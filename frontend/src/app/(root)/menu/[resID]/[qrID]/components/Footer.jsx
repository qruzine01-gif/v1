import { MapPin, Phone, Mail, Globe } from "lucide-react"

export default function Footer({ restaurant }) {
  const addressParts = [
    restaurant?.location?.address,
    restaurant?.location?.area,
    restaurant?.location?.state,
    restaurant?.location?.pincode,
  ].filter(Boolean)
  const year = new Date().getFullYear()
  const websiteHref = restaurant?.contactInfo?.website
    ? (restaurant.contactInfo.website.startsWith('http://') || restaurant.contactInfo.website.startsWith('https://')
        ? restaurant.contactInfo.website
        : `https://${restaurant.contactInfo.website}`)
    : undefined

  return (
    <footer className="border-t-2 mt-12" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'rgb(212, 175, 55)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Restaurant */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold" style={{ color: 'rgb(212, 175, 55)' }}>Restaurant</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <div><span className="text-gray-400">Name:</span> {restaurant?.name || '—'}</div>
              <div><span className="text-gray-400">Business Type:</span> {restaurant?.businessType || '—'}</div>
              <div><span className="text-gray-400">GST:</span> {restaurant?.gstNumber || '—'}</div>
            </div>
          </div>

          {/* Address & Contact */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold" style={{ color: 'rgb(212, 175, 55)' }}>Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" style={{ color: 'rgb(212, 175, 55)' }} />
                <span className="text-gray-300">{addressParts.length ? addressParts.join(', ') : '—'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" style={{ color: 'rgb(212, 175, 55)' }} />
                <span className="text-gray-300">{restaurant?.contactInfo?.phone || '—'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" style={{ color: 'rgb(212, 175, 55)' }} />
                <span className="text-gray-300">{restaurant?.contactInfo?.email || '—'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" style={{ color: 'rgb(212, 175, 55)' }} />
                {restaurant?.contactInfo?.website ? (
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {restaurant.contactInfo.website}
                  </a>
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </div>
            </div>
          </div>

          {/* Identifiers */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold" style={{ color: 'rgb(212, 175, 55)' }}>Identifiers</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <div><span className="text-gray-400">Restaurant ID:</span> {restaurant?.resID || '—'}</div>
            </div>
          </div>
        </div>

        <div className="border-t mt-6 pt-6 text-center" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
          <p className="text-sm text-gray-400">© {year} {restaurant?.name || 'Restaurant'}. All rights reserved.</p>
          <p className="text-xs text-gray-500 mt-1">Powered by <span className="font-semibold vw-anim " style={{ color: 'rgb(212, 175, 55)' }}>Qruzine</span></p>
          
          <p className="text-xs text-gray-500 mt-1">
            <a
              href="https://www.vigyapanwala.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
              style={{ letterSpacing: '0.3em', color: 'rgb(212, 175, 55)' }}
            >
              V I G Y A P A N W A L A
            </a>
            
          </p>
          
        </div>
      </div>
      <style jsx>{`
        .vw-anim {
          background: linear-gradient(90deg,
            #a67c00 0%,
            #d4af37 20%,
            #fff1a8 40%,
            #d4af37 60%,
            #8b6b00 80%,
            #d4af37 100%
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: vw-shimmer 4s ease-in-out infinite;
          text-decoration-color: rgba(212,175,55,0.9);
          filter: drop-shadow(0 0 1px rgba(212,175,55,0.45));
          letter-spacing: 0.2px;
        }

        .vw-anim:hover {
          filter: drop-shadow(0 0 3px rgba(212,175,55,0.65));
        }

        @keyframes vw-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .vw-anim { animation: none; background-position: 100% 50%; }
        }
      `}</style>
    </footer>
  )
}