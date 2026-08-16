"use client";

import React from "react";
import { MapPin, Phone, Clock, MessageCircle, Navigation, Truck } from "lucide-react";

export function LocationSection() {
  const phone = "9851045662";
  const whatsapp = "9779851045662";

  return (
    <section id="location" className="py-16 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold text-blue-400">
            <MapPin className="w-4 h-4" />
            <span>VISIT OUR FLAGSHIP STORE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Conveniently Located at <span className="text-gradient-blue">Samakhushi Chowk</span>
          </h2>
          <p className="text-slate-300 text-sm">
            Experience the appliances in person or enjoy hassle-free doorstep delivery across Kathmandu, Lalitpur, and Bhaktapur.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Info Card */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl space-y-6 flex flex-col justify-between border border-slate-800">
            <div className="space-y-6">
              
              <div className="flex items-start space-x-4">
                <div className="p-3.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Store Address</h3>
                  <p className="text-sm text-slate-300 mt-1">
                    Join Electronic Center<br />
                    Samakhushi Chowk, Tokha Road, Kathmandu, Nepal
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Near Ring Road bridge connection</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3.5 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Opening Hours</h3>
                  <p className="text-sm text-slate-300 mt-1">
                    Monday – Sunday: <strong>9:30 AM – 8:00 PM</strong>
                  </p>
                  <span className="inline-block mt-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-md">
                    Open 7 Days a Week
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3.5 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Delivery & Installation</h3>
                  <p className="text-sm text-slate-300 mt-1">
                    Free doorstep delivery & unboxing setup anywhere inside Kathmandu Valley. All Nepal highway cargo available.
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800">
              <a
                href={`tel:${phone}`}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Call: {phone}</span>
              </a>

              <a
                href="https://maps.google.com/?q=Join+Electronic+Center+Samakhushi+Kathmandu"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-blue-900/30"
              >
                <Navigation className="w-4 h-4" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Visual Frame */}
          <div className="lg:col-span-6 glass-panel rounded-3xl overflow-hidden min-h-[340px] relative border border-slate-800 flex items-center justify-center">
            <iframe
              title="Join Electronic Center Samakhushi Location"
              src="https://maps.google.com/maps?q=Samakhushi+Chowk+Kathmandu+Nepal&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[380px] border-0 filter grayscale contrast-125 opacity-80 hover:opacity-100 transition duration-300"
              loading="lazy"
            />
            <div className="absolute top-4 left-4 glass-panel bg-slate-950/90 border border-slate-700 p-3 rounded-2xl shadow-xl pointer-events-none">
              <p className="font-extrabold text-xs text-white">Join Electronic Center</p>
              <p className="text-[10px] text-slate-400">Samakhushi Chowk, Kathmandu</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
