import { motion } from "framer-motion";
import { ArrowRight, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    title: "5 Tips for Building Better Medication Habits",
    excerpt: "Discover science-backed strategies to improve your medication adherence and build lasting healthy habits.",
    category: "Health Tips",
    author: "Dr. Sarah Chen",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop",
  },
  {
    title: "How AI is Revolutionizing Healthcare Compliance",
    excerpt: "Learn how artificial intelligence is helping patients stay on track with their treatment plans.",
    category: "Technology",
    author: "Michael Torres",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=250&fit=crop",
  },
  {
    title: "Managing Multiple Medications: A Complete Guide",
    excerpt: "Expert advice on organizing and tracking multiple prescriptions without the confusion.",
    category: "Guides",
    author: "Dr. Emily Watson",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=250&fit=crop",
  },
];

const BlogSection = () => {
  return (
    <section id="blog" className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-medium mb-4">
              Latest Articles
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Health & <span className="text-gradient">Wellness Blog</span>
            </h2>
          </div>
          <Button variant="outline" className="shrink-0">
            View All Posts
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <div className="glass rounded-2xl overflow-hidden h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
