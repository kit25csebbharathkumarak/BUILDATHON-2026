export default async function CourseDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="container py-12 animate-fade-in">
      <div className="card mb-8 bg-gradient-to-r from-primary-light to-white">
        <div className="max-w-3xl">
          <span className="badge badge-primary mb-4">Computer Science</span>
          <h1 className="text-4xl font-bold mb-4">Advanced Machine Learning (Course {id})</h1>
          <p className="text-xl text-muted mb-6">Master neural networks and deep learning with real-world projects. Learn how to build AI models from scratch.</p>
          <div className="flex gap-4">
            <button className="btn btn-primary">Enroll Now - $99</button>
            <button className="btn btn-outline">View Syllabus</button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">About This Course</h2>
            <p className="text-muted">This course will take you from the basics of machine learning to advanced deep learning architectures. We cover everything from linear regression to transformers and LLMs.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Syllabus</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((week) => (
                <div key={week} className="card p-4">
                  <h3 className="font-bold mb-2">Week {week}: Core Concepts</h3>
                  <p className="text-sm text-muted">Introduction to the fundamental theories and mathematics behind the models.</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-bold mb-4">Course Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span className="text-muted">Level</span> <span>Advanced</span></li>
              <li className="flex justify-between"><span className="text-muted">Duration</span> <span>12 Weeks</span></li>
              <li className="flex justify-between"><span className="text-muted">Lessons</span> <span>48</span></li>
              <li className="flex justify-between"><span className="text-muted">Certificate</span> <span>Yes</span></li>
            </ul>
          </div>
          
          <div className="card">
            <h3 className="font-bold mb-4">Instructor</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-light rounded-full"></div>
              <div>
                <div className="font-bold">Dr. Alan Turing</div>
                <div className="text-sm text-muted">AI Researcher</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
