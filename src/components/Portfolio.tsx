
import React, { useState } from 'react';
import { ExternalLink, Github, Eye, Code } from 'lucide-react';

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState(0);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Full-stack MERN application with React, Node.js, Express, and MongoDB",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
      category: "MERN Stack",
      preview: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      codeSnippet: `// User Authentication Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Product Routes
app.get('/api/products', async (req, res) => {
  const products = await Product.find()
    .populate('category')
    .sort({ createdAt: -1 });
  res.json(products);
});`,
      github: "https://github.com/nodexStation",
      live: "https://nodexstation-ecommerce-demo.lovableproject.com"
    },
    {
      id: 2,
      title: "3D Product Visualizer",
      description: "Interactive Three.js application for product customization and visualization",
      technologies: ["Three.js", "React", "GSAP", "WebGL"],
      category: "Three.js",
      preview: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
      codeSnippet: `// Three.js Scene Setup
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class ProductVisualizer {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.init();
  }
  
  init() {
    // Setup renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);
    
    // Add controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.animate();
  }
}`,
      github: "https://github.com/nodexStation",
      live: "https://nodexstation-3d-demo.lovableproject.com"
    },
    {
      id: 3,
      title: "AI Customer Support Bot",
      description: "Intelligent chatbot with natural language processing and machine learning",
      technologies: ["Python", "OpenAI", "FastAPI", "React", "WebSocket"],
      category: "AI Agent",
      preview: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
      codeSnippet: `# AI Agent Implementation
import openai
from fastapi import FastAPI, WebSocket
import asyncio

app = FastAPI()

class CustomerSupportAgent:
    def __init__(self):
        self.client = openai.OpenAI()
        self.conversation_history = []
    
    async def process_message(self, message: str) -> str:
        """Process user message and generate AI response"""
        try:
            # Add user message to history
            self.conversation_history.append({
                "role": "user", 
                "content": message
            })
            
            # Generate AI response
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful customer support agent."},
                    *self.conversation_history
                ],
                max_tokens=150,
                temperature=0.7
            )
            
            ai_message = response.choices[0].message.content
            self.conversation_history.append({
                "role": "assistant",
                "content": ai_message
            })
            
            return ai_message
        except Exception as e:
            return f"Error processing request: {str(e)}"

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    agent = CustomerSupportAgent()
    
    while True:
        data = await websocket.receive_text()
        response = await agent.process_message(data)
        await websocket.send_text(response)`,
      github: "https://github.com/nodexStation",
      live: "https://nodexstation-ai-chat-demo.lovableproject.com"
    },
    {
      id: 4,
      title: "Data Analytics Dashboard",
      description: "Real-time data scraping and visualization platform with automated reporting",
      technologies: ["Python", "Scrapy", "React", "D3.js", "PostgreSQL"],
      category: "Data Scraping",
      preview: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      codeSnippet: `# Advanced Web Scraping Pipeline
import scrapy
import pandas as pd
from scrapy.crawler import CrawlerProcess
import asyncio

class DataScrapingSpider(scrapy.Spider):
    name = 'market_data'
    
    def __init__(self, target_urls=None):
        self.target_urls = target_urls or []
        self.scraped_data = []
    
    def start_requests(self):
        for url in self.target_urls:
            yield scrapy.Request(
                url=url,
                callback=self.parse_data,
                meta={'dont_cache': True}
            )
    
    def parse_data(self, response):
        """Extract structured data from web pages"""
        data = {
            'title': response.css('h1::text').get(),
            'price': response.css('.price::text').re_first(r'\\$([\\d,]+)'),
            'description': response.css('.description::text').getall(),
            'ratings': response.css('.rating::text').get(),
            'availability': response.css('.stock::text').get(),
            'url': response.url,
            'scraped_at': pd.Timestamp.now()
        }
        
        # Data cleaning and validation
        if self.validate_data(data):
            self.scraped_data.append(data)
            yield data
    
    def validate_data(self, data):
        """Validate scraped data quality"""
        required_fields = ['title', 'price']
        return all(data.get(field) for field in required_fields)

# Async data processing
async def process_scraped_data(data_batch):
    """Process and store scraped data"""
    df = pd.DataFrame(data_batch)
    
    # Data transformation
    df['price_numeric'] = df['price'].str.replace(',', '').astype(float)
    df['category'] = df['title'].apply(classify_product)
    
    # Store in database
    await store_to_database(df)`,
      github: "https://github.com/nodexStation",
      live: "https://nodexstation-analytics-demo.lovableproject.com"
    }
  ];

  const categories = ["All", "MERN Stack", "Three.js", "AI Agent", "Data Scraping"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const handleLiveDemo = (project: typeof projects[0]) => {
    // Open live demo in new tab
    window.open(project.live, '_blank', 'noopener,noreferrer');
  };

  const handleViewCode = (project: typeof projects[0]) => {
    // Open GitHub repository in new tab
    window.open(project.github, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-terminal-green mb-6">
            <span className="syntax-keyword">class</span> <span className="syntax-function">Portfolio</span> {"{"}
          </h2>
          <p className="text-terminal-text/80 text-lg pl-6">
            <span className="syntax-comment">/*</span><br />
            <span className="syntax-comment"> * Showcase of our innovative projects and technical expertise</span><br />
            <span className="syntax-comment"> * Each project represents cutting-edge solutions</span><br />
            <span className="syntax-comment"> */</span>
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                  activeCategory === category
                    ? 'bg-terminal-green text-terminal-bg'
                    : 'bg-terminal-bg border border-terminal-border text-terminal-text hover:border-terminal-green'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Project List */}
          <div className="space-y-4">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(index)}
                className={`bg-terminal-bg/50 border rounded-lg p-6 cursor-pointer transition-all hover:scale-105 ${
                  selectedProject === index
                    ? 'border-terminal-green glow-effect'
                    : 'border-terminal-border hover:border-terminal-green/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-terminal-text mb-2">
                      {project.title}
                    </h3>
                    <span className="text-terminal-green text-sm bg-terminal-green/10 px-2 py-1 rounded">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewCode(project);
                      }}
                      className="text-terminal-text/60 hover:text-terminal-green transition-colors p-1 rounded hover:bg-terminal-green/10"
                      title="View Code"
                    >
                      <Github className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLiveDemo(project);
                      }}
                      className="text-terminal-text/60 hover:text-terminal-green transition-colors p-1 rounded hover:bg-terminal-green/10"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <p className="text-terminal-text/70 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-terminal-border text-terminal-text px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLiveDemo(project);
                    }}
                    className="flex-1 bg-terminal-green/10 hover:bg-terminal-green/20 text-terminal-green py-2 px-4 rounded text-sm border border-terminal-green/30 hover:border-terminal-green/50 transition-all duration-200"
                  >
                    Live Demo
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewCode(project);
                    }}
                    className="flex-1 bg-terminal-blue/10 hover:bg-terminal-blue/20 text-terminal-blue py-2 px-4 rounded text-sm border border-terminal-blue/30 hover:border-terminal-blue/50 transition-all duration-200"
                  >
                    View Code
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Project Preview */}
          <div className="bg-[#1e1e1e] rounded-lg border border-terminal-border overflow-hidden">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-[#323233] border-b border-terminal-border">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-terminal-text text-sm ml-4">
                  {filteredProjects[selectedProject]?.title}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`p-1 rounded transition-colors ${
                    viewMode === 'preview'
                      ? 'bg-terminal-green text-terminal-bg'
                      : 'text-terminal-text/60 hover:text-terminal-text'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className={`p-1 rounded transition-colors ${
                    viewMode === 'code'
                      ? 'bg-terminal-green text-terminal-bg'
                      : 'text-terminal-text/60 hover:text-terminal-text'
                  }`}
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="h-96">
              {viewMode === 'preview' ? (
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${filteredProjects[selectedProject]?.preview})` }}
                >
                  <div className="w-full h-full bg-black/20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        {filteredProjects[selectedProject]?.title}
                      </h3>
                      <p className="text-white/80">
                        {filteredProjects[selectedProject]?.description}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 h-full overflow-y-auto">
                  <pre className="text-sm text-terminal-text font-mono leading-relaxed">
                    <code className="language-javascript">
                      {filteredProjects[selectedProject]?.codeSnippet}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-terminal-green text-4xl font-bold">{"}"}</p>
      </div>
    </section>
  );
};

export default Portfolio;
