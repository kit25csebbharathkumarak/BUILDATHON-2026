export default function Contact() {
  return (
    <div className="container py-12 max-w-4xl animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Name</label>
              <input type="text" className="w-full p-2 border border-glass-border rounded-md bg-surface-hover" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Email</label>
              <input type="email" className="w-full p-2 border border-glass-border rounded-md bg-surface-hover" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Message</label>
              <textarea rows={4} className="w-full p-2 border border-glass-border rounded-md bg-surface-hover"></textarea>
            </div>
            <button className="btn btn-primary w-full justify-center">Send Message</button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-bold mb-2">Contact Information</h3>
            <p className="text-muted text-sm mb-4">Reach out to us directly via email or phone.</p>
            <ul className="space-y-2 text-sm">
              <li><strong>Email:</strong> support@eduportal.ai</li>
              <li><strong>Phone:</strong> +1 (555) 123-4567</li>
              <li><strong>Address:</strong> 123 AI Boulevard, Tech City</li>
            </ul>
          </div>
          
          <div className="card bg-primary-light">
            <h3 className="font-bold text-primary mb-2">Need Immediate Help?</h3>
            <p className="text-sm text-primary mb-4">Our AI support bot can answer most common questions instantly.</p>
            <button className="btn btn-outline bg-white w-full justify-center">Chat with AI Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}
