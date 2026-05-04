export default function About() {
  return (

    <div className="bg-[#FAFAFA] min-h-screen">
      <div
        className="relative text-white text-center py-16 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://cms.disway.id/uploads/9120b5e5fb7e8f7cedf34f55f439ba51.jpg')",
        }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="relative text-2xl font-semibold">
          About Endfield Industries
        </h1>
      </div>

      <div className="max-w-[1000px] mx-auto py-12 px-6">
        <div className="grid grid-cols-2 gap-10">
          <div>
            <h2 className="text-lg font-bold mb-3 text-black animate-zoomIn">
              Our Profile Company
            </h2>
            <p className="text-sm text-black leading-relaxed">
              Endfield Industries is a massive, independent industrial corporation that serves as a cornerstone of humanity’s efforts to colonize the planet Talos-II.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3">
              Our Vision and Mission
            </h2>
            <p className="text-sm text-black mb-3 leading-relaxed">
              To be a pioneer of a new civilization capable of conquering and stabilizing the extreme environment.
            </p>

            <div className="text-sm text-black">
              <p className="font-semibold mb-2">Mission:</p>
              <ol className="list-decimal pl-5 space-y-2 leading-relaxed">
                <li><span className="font-medium">Territorial Expansion:</span> Explore new regions.</li>
                <li><span className="font-medium">Infrastructure:</span> Build automated systems.</li>
                <li><span className="font-medium">Anomaly Control:</span> Ensure safety.</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-10">
          <div className="h-[180px] rounded-lg overflow-hidden shadow-xl transition duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
            <img
              src="https://assets.promediateknologi.id/crop/0x0:0x0/1200x0/webp/photo/p3/75/2026/01/23/AA1UF7R1-405964048.png"
              alt="Image 1"
              className="w-full h-full object-cover object-top transition duration-300 hover:scale-110"
            />
          </div>

          <div className="h-[180px] rounded-lg overflow-hidden shadow-xl transition duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
            <img
              src="https://cms.disway.id/uploads/60e9c019764479ece9276ef323c90323.png"
              alt="Image 2"
              className="w-full h-full object-cover object-top transition duration-300 hover:scale-110"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#313739] py-16">
        <div className="max-w-[1000px] mx-auto text-center px-6">
          <div className="w-16 h-1 bg-yellow-400 mx-auto mb-4 rounded"></div>

          <h2 className="text-2xl font-bold mb-2 text-white animate-reveal">
            Company Updates
          </h2>
          <p className="mt-4 text-white text-sm mb-10">
            Stay updated with our latest news and developments.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="bg-white p-4 w-[300px] flex items-center gap-4 rounded-[10px] shadow-xl transition duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
              <div className="w-[200px] h-[60px] bg-gray-300 rounded-[10px]">
                <img src="https://static0.thegamerimages.com/wordpress/wp-content/uploads/wm/2026/01/arknights-endfield-placing-the-pac-structure.jpg?w=1600&h=900&fit=crop" className="rounded-[10px]" /></div>
              <div className="text-left">
                <h4 className="font-semibold text-sm">
                  New Facility Expansion
                </h4>
                <p className="text-xs text-gray-500">
                  We are expanding our industrial facilities.
                </p>
              </div>
            </div>

            <div className="bg-white p-4 w-[300px] flex items-center gap-4 rounded-[10px] shadow-xl transition duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
              <div className="w-[200px] h-[60px] bg-gray-300 rounded-[10px]"><img src="https://blog-uploads.eneba.games/uploads/2026/01/ARKNIGHT-HUB-768x430.jpg" className="rounded-[10px]" /></div>
              <div className="text-left">
                <h4 className="font-semibold text-sm">
                  System Upgrade Incoming
                </h4>
                <p className="text-xs text-gray-500">
                  Major infrastructure upgrades coming soon.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="mt-20 bg-gray-300 h-[200px] overflow-hidden rounded-[10px] flex items-center justify-center text-sm text-gray-600 shadow-[0_5px_9px_rgba(0,0,0,0.1)]">
            <img src="https://gamingonphone.com/wp-content/uploads/2026/01/arknights-endfield-team-building-guide-cover.jpg" className="transition duration-500 hover:scale-110"/>
          </div>
          </div>

        </div>
      </div>

    </div>
  );
}