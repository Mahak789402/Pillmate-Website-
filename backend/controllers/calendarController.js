
import asyncHandler from 'express-async-handler';
import { google } from 'googleapis';
import User from '../models/userModel.js';
import Medicine from '../models/medicineModel.js';

// Configuration is read inside functions to ensure dotenv is loaded
const REDIRECT_URI = 'http://localhost:5000/api/calendar/callback';

const createOAuth2Client = () => {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error("ERROR: Missing Google Credentials in .env");
        throw new Error('Google Client ID and Secret are missing in .env');
    }
    return new google.auth.OAuth2(
        CLIENT_ID.trim(),
        CLIENT_SECRET.trim(),
        REDIRECT_URI
    );
};

// @desc    Generate Google Auth URL
// @route   GET /api/calendar/auth
// @access  Private
const getAuthUrl = asyncHandler(async (req, res) => {
    try {
        console.log("--- Calendar Auth Request ---");

        const oauth2Client = createOAuth2Client();

        const scopes = [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events'
        ];

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline', // Request refresh token
            scope: scopes,
            state: req.user._id.toString() // Pass user ID to persist through callback
        });

        console.log("Generated Auth URL:", url);
        res.json({ url });
    } catch (error) {
        console.error("Error in getAuthUrl:", error);
        res.status(500);
        throw new Error(error.message);
    }
});

// @desc    Handle Google Auth Callback
// @route   GET /api/calendar/callback
// @access  Public (Called by Google)
const googleAuthCallback = asyncHandler(async (req, res) => {
    const { code, state } = req.query;

    if (!code || !state) {
        res.status(400);
        throw new Error('Invalid callback request');
    }

    try {
        const oauth2Client = createOAuth2Client();
        const { tokens } = await oauth2Client.getToken(code);

        // state contains userId passed in getAuthUrl
        const user = await User.findById(state);

        if (user) {
            user.googleCalendarToken = tokens;
            await user.save();

            // Redirect back to frontend settings page
            res.redirect('http://localhost:8080/settings?status=connected');
        } else {
            res.status(404);
            throw new Error('User not found during callback');
        }
    } catch (error) {
        console.error('Callback error:', error);
        res.redirect('http://localhost:8080/settings?status=failed');
    }
});

// @desc    Sync Medicines to Calendar
// @route   POST /api/calendar/sync
// @access  Private
const syncSchedule = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user || !user.googleCalendarToken) {
        res.status(400);
        throw new Error('User not connected to Google Calendar');
    }

    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials(user.googleCalendarToken);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Real sync logic: Sync for the next 7 days
    try {
        const medicines = await Medicine.find({ user: req.user._id });
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        let createdEvents = 0;

        for (const med of medicines) {
            // Check if medicine is active
            if (med.endDate && new Date(med.endDate) < now) continue;
            if (new Date(med.startDate) > nextWeek) continue;

            for (let i = 0; i < 7; i++) {
                const date = new Date(now);
                date.setDate(date.getDate() + i);

                // Simple check for daily frequency (improve for specific days later)
                // Assuming 'daily' or check 'frequency' field if exists, but for MVP we assume daily for times

                for (const time of med.times) {
                    const [hours, minutes] = time.split(':');
                    const eventDateTime = new Date(date);
                    eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0);

                    if (eventDateTime < now) continue; // Skip past times
                    if (med.endDate && eventDateTime > new Date(med.endDate)) continue;

                    const event = {
                        summary: `Take ${med.name} (${med.dosage})`,
                        description: `PillMate Reminder: Take your medicine. Stock: ${med.currentStock}`,
                        start: {
                            dateTime: eventDateTime.toISOString(),
                            timeZone: 'Asia/Kolkata', // Ideally user's timezone
                        },
                        end: {
                            dateTime: new Date(eventDateTime.getTime() + 15 * 60000).toISOString(), // 15 min duration
                            timeZone: 'Asia/Kolkata',
                        },
                        reminders: {
                            useDefault: false,
                            overrides: [
                                { method: 'popup', minutes: 10 },
                            ],
                        },
                    };

                    await calendar.events.insert({
                        calendarId: 'primary',
                        resource: event,
                    });
                    createdEvents++;
                }
            }
        }

        res.json({ message: `Sync successful. Created ${createdEvents} events for the coming week.` });

    } catch (error) {
        console.error('Calendar sync error:', error);
        if (error.code === 401) {
            // Token expired or invalid
            user.googleCalendarToken = null;
            await user.save();
            res.status(401);
            throw new Error('Token expired, please reconnect');
        }
        res.status(500);
        throw new Error('Failed to sync with Google Calendar');
    }
});

export { getAuthUrl, googleAuthCallback, syncSchedule };
