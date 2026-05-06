export default function About() {
  return (

    <div className="bg-[#FAFAFA] min-h-screen">
      <div
        className="relative text-white text-center py-[1vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://cms.disway.id/uploads/9120b5e5fb7e8f7cedf34f55f439ba51.jpg')",
        }}>
        <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
        <h1 className="relative text-[1.8vw] font-semibold tracking-wide ">
          About Endfield Industries
        </h1>
      </div>

      <div className="max-w-[85vw] mx-auto py-[8vh] px-[4vw]">
        <div className="grid grid-cols-2 gap-[5vw]">
          <div>
            <h2 className="text-[1.2vw] font-bold mb-[1.5vh] text-black animate-zoomIn">
              Our Profile Company
            </h2>
            <p className="text-[0.8vw] text-black leading-relaxed">
              Endfield Industries is a massive, independent industrial corporation that serves as a cornerstone of humanity’s efforts to colonize the planet Talos-II.
            </p>
          </div>

          <div>
            <h2 className="text-[1.2vw] font-bold mb-[1.vh]">
              Our Vision and Mission
            </h2>
            <p className="text-[0.8vw] text-black mb-[1.5vh] leading-relaxed">
              To be a pioneer of a new civilization capable of conquering and stabilizing the extreme environment.
            </p>

            <div className="text-[0.8vw] text-black">
              <p className="font-semibold mb-[1vh]">Mission:</p>
              <ol className="list-decimal pl-[1.2vw] space-y-[1vh] leading-relaxed">
                <li><span className="font-medium">Territorial Expansion:</span> Explore new regions.</li>
                <li><span className="font-medium">Infrastructure:</span> Build automated systems.</li>
                <li><span className="font-medium">Anomaly Control:</span> Ensure safety.</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[3vw] mt-[6vh]">
          <div className="h-[32vh] w-[35vw] rounded-xl overflow-hidden shadow-xl transition duration-300 ease-in-out hover:-translate-y-[1vh] hover:shadow-2xl">
            <img
              src="https://assets.promediateknologi.id/crop/0x0:0x0/1200x0/webp/photo/p3/75/2026/01/23/AA1UF7R1-405964048.png"
              alt="Image 1"
              className="w-full h-full object-cover object-top transition duration-500 hover:scale-110"
            />
          </div>

          <div className="h-[32vh] w-[35vw] rounded-xl overflow-hidden shadow-xl transition duration-300 ease-in-out hover:-translate-y-[1vh] hover:shadow-2xl">
            <img
              src="https://cms.disway.id/uploads/60e9c019764479ece9276ef323c90323.png"
              alt="Image 2"
              className="w-full h-full object-cover object-top transition duration-500 hover:scale-110"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#313739] py-[10vh]">
        <div className="max-w-[85vw] mx-auto text-center px-[4vw]">
          <div className="w-[10vw] h-[0.6vh] bg-[#F8F546] mx-auto mb-[2vh] rounded-full"></div>

          <h2 className="text-[2.1vw] font-bold mb-[1vh] text-white animate-reveal">
            Company Updates
          </h2>
          <p className="mt-[2vh] text-white text-[0.9vw] mb-[5vh]">
            Stay updated with our latest news and developments.
          </p>

          <div className="flex justify-center gap-[3.5vw] flex-wrap">
            <div className="bg-white p-[1vw] w-[25vw] flex items-center gap-[1vw] rounded-xl shadow-xl transition duration-300 ease-in-out hover:-translate-y-[1vh] hover:shadow-2xl">
              <div className="w-[12vw] h-[11vh] bg-gray-300 rounded-lg overflow-hidden">
                <img src="https://static0.thegamerimages.com/wordpress/wp-content/uploads/wm/2026/01/arknights-endfield-placing-the-pac-structure.jpg?w=1600&h=900&fit=crop" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-[1vw]">
                  New Facility Expansion
                </h4>
                <p className="text-[0.9vw] text-gray-500">
                  We are expanding our industrial facilities.
                </p>
              </div>
            </div>

            <div className="bg-white p-[1.5vw] w-[25vw] flex items-center gap-[1vw] rounded-xl shadow-xl transition duration-300 ease-in-out hover:-translate-y-[1vh] hover:shadow-2xl">
              <div className="w-[12vw] h-[11vh] bg-gray-300 rounded-lg overflow-hidden">
                <img src="https://blog-uploads.eneba.games/uploads/2026/01/ARKNIGHT-HUB-768x430.jpg" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-[1vw]">
                  System Upgrade Incoming
                </h4>
                <p className="text-[0.9vw] text-gray-500">
                  Major infrastructure upgrades coming soon.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-[9vh] flex justify-center items-center">
  <div className="w-[49vw] h-[38vh] rounded-xl shadow-xl overflow-hidden">
    <div className="w-full h-full transition duration-500 hover:scale-105">
      <iframe
        src="https://www.youtube.com/embed/OYv6yJUgTQk"
        className="w-full h-full rounded-xl"
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      ></iframe>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}