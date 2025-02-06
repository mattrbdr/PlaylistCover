import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"

function MentionsLegales() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/">
          <Button 
            variant="ghost" 
            className="mb-8 text-slate-600 hover:text-slate-900 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Button>
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-8">Legal Notice</h1>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Website Editor</h2>
            <p className="text-slate-600 mb-4">
              PlaylistCover is a free open-source project created and maintained by:<br />
              Mattéo Rbdr<br />
              <a href="https://matteorbdr.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                matteorbdr.com
              </a><br />
              <a href="https://instagram.com/matteorbdr" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                @matteorbdr
              </a><br />
              Email: contact@matteorbdr.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Hosting</h2>
            <p className="text-slate-600 mb-4">
              This website is hosted by o2switch<br />
              222-224 Boulevard Gustave Flaubert<br />
              63000 Clermont-Ferrand<br />
              France
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Intellectual Property</h2>
            <p className="text-slate-600 mb-4">
              PlaylistCover is an open-source project. The source code is freely available. 
              If you wish to support this project, you can do so via{' '}
              <a 
                href="https://matteorbdr.substack.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700"
              >
                my Substack
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Data Protection</h2>
            <p className="text-slate-600 mb-4">
              PlaylistCover does not collect or store any personal data. Images you import 
              are processed locally in your browser and are never sent to our servers. 
              We don't sell any data because we don't collect any.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Cookies</h2>
            <p className="text-slate-600 mb-4">
              This site does not use tracking or advertising cookies. Only cookies strictly 
              necessary for the website to function may be used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Development</h2>
            <p className="text-slate-600">
              This project was developed using Cursor, powered by Claude-3.5 Sonnet AI model.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default MentionsLegales 