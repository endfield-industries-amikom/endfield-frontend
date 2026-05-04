export default function About() {
  return (
    <div className="bg-[#e5e5e5] min-h-screen">

      <div className="bg-[#6b6b6b] text-white text-center py-6">
        <h1 className="text-xl font-semibold">
          About Endfield Industries
        </h1>
      </div>

      <div className="max-w-[1000px] mx-auto py-10 px-6">
        <div className="grid grid-cols-2 gap-10">
          <div>
            <h2 className="text-lg font-bold mb-3">
              Our Profile Company
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Endfield Industries is a massive, independent industrial corporation that serves as a cornerstone of humanity’s efforts to colonize the planet Talos-II. Unlike paramilitary organizations such as Rhodes Island, Endfield focuses on heavy industry, territorial exploration, and infrastructure development in uncharted regions.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3">
              Our Vision and Mission
            </h2>
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
              To be a pioneer of a new civilization capable of conquering and stabilizing the extreme environment of the planet Talos-II through technological excellence and industrial integration.
            </p>

            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-2">Mission:</p>
              <ol className="list-decimal pl-5 space-y-2 leading-relaxed">
                <li>
                  <span className="font-medium">Territorial Expansion:</span> Explore uncharted frontier regions to search for resources and habitable land.
                </li>
                <li>
                  <span className="font-medium">Automated Infrastructure:</span> Build a self-sustaining logistics and production network through the Automated Industry Complex (AIC) system.
                </li>
                <li>
                  <span className="font-medium">Anomaly Control:</span> Study and minimize the adverse effects of The Blight to ensure human operational safety.
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-10">
          <div className=" shadow-[0_2px_4px_rgba(0,0,0,0.1)] h-[150px] bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm">
            Image 1
          </div>
          <div className="shadow-[0_2px_4px_rgba(0,0,0,0.1)] h-[150px] bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm">
            Image 2
          </div>
        </div>
      </div>

      <div className="bg-[#f3f3f3] py-12">
        <div className="max-w-[1000px] mx-auto text-center px-6">

          <h2 className="text-2xl font-bold mb-2">
            Company Updates
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Stay updated with our latest news and developments from Endfield Industries.
          </p>

          <div className="flex justify-center gap-6 flex-wrap">

            <div className="bg-white  p-4 w-[300px] flex items-center gap-4 rounded shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
              <div className="w-[60px] h-[60px] bg-gray-300"></div>
              <div className="text-left">
                <h4 className="font-semibold text-sm">
                  New Facility Expansion
                </h4>
                <p className="text-xs text-gray-500">
                  We are expanding our industrial facilities into new frontier zones.
                </p>
              </div>
            </div>

            <div className="bg-white p-4 w-[300px] flex items-center gap-4 rounded shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
              <div className="w-[60px] h-[60px] bg-gray-300"></div>
              <div className="text-left">
                <h4 className="font-semibold text-sm">
                  System Upgrade Incoming
                </h4>
                <p className="text-xs text-gray-500">
                  Major infrastructure upgrades will be deployed next cycle.
                </p>
              </div>
            </div>

          </div>
          <div className="mt-11 bg-gray-300 h-[200px] rounded flex items-center justify-center text-sm text-gray-600">
            Trusted by thousands of customers worldwide.
          </div>
        </div>
      </div>

    </div>
  );
}