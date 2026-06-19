import { Fragment } from "react/jsx-runtime";

export default function Dashboard() {
  return (
    <Fragment>
      <div className="flex min-h-screen bg-stone-100">
  
        <aside className="w-64 bg-stone-200 p-4">
          <h1 className="text-2xl font-bold">Endfield ERP</h1>
          <p className="text-sm text-gray-500">Supply Chain Ops</p>

          <nav className="mt-8 space-y-2">
            <button className="w-full text-left p-3 rounded bg-yellow-400 font-medium">
              Master data 
            </button>

            <button className="w-full text-left p-3 rounded hover:bg-stone-300">
              Production
            </button>

            <button className="w-full text-left p-3 rounded hover:bg-stone-300">
              procurement
            </button>

            <button className="w-full text-left p-3 rounded hover:bg-stone-300">
              losgistics
            </button>

            <button className="w-full text-left p-3 rounded hover:bg-stone-300">
              analytics
            </button>

            <button className="w-full text-left p-3 rounded hover:bg-stone-300">
              Repoort
            </button>

          </nav>

          <button className="mt-90 w-full bg-yellow-500 text-white py-3 rounded-lg">
            + New Operation
          </button>
          <button className="w-full text-left p-3 rounded hover:bg-stone-300">
            settings
          </button>
          <button className="w-full text-left p-3 rounded hover:bg-stone-300">
            logout
          </button>

        </aside>

       
        <main className="flex-1 p-6">
      
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">
              CNC Milling Machine X-01
            </h2>

            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white rounded border">
                Download Spec
              </button>

              <button className="px-4 py-2 bg-white rounded border">
                Log Issue
              </button>

              <button className="px-4 py-2 bg-yellow-400 rounded">
                Schedule Maintenance
              </button>
            </div>
          </div>

         
          <div className="grid grid-cols-3 gap-6">
            {/* Machine Image */}
            <div className="bg-white rounded-xl shadow p-4">
              <img
                src="https://via.placeholder.com/500x300"
                alt="Machine"
                className="rounded-lg w-full"
              />
            </div>

       
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold mb-4">
                Machine Specifications
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">Model</p>
                  <p>PrecisionFlow X-2000</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Manufacturer</p>
                  <p>Machina Global</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Installed</p>
                  <p>12 Oct 2022</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Location</p>
                  <p>Sector B / Bay 04</p>
                </div>
              </div>
            </div>

      
            <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center">
              <div className="w-36 h-36 rounded-full border-8 border-yellow-500 flex items-center justify-center">
                <span className="text-4xl font-bold">98%</span>
              </div>

              <p className="mt-4 text-green-600 font-semibold">
                Optimal Performance
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="font-semibold mb-4">Spindle Speed</h4>

              <div className="text-center">
                <p className="text-4xl font-bold">12,400</p>
                <p className="text-gray-500">RPM</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="font-semibold mb-4">Vibration Analysis</h4>

              <div className="h-32 flex items-end gap-2">
                {[20, 45, 25, 80, 40, 30, 55, 25].map((v, i) => (
                  <div
                    key={i}
                    className="bg-yellow-500 flex-1"
                    style={{ height: `${v}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="font-semibold mb-4">Core Temperature</h4>

              <p className="text-4xl font-bold">42.8°C</p>

              <div className="mt-4 h-3 bg-gray-200 rounded-full">
                <div className="w-1/2 h-full bg-yellow-500 rounded-full"></div>
              </div>

              <p className="mt-2 text-green-600">Stable</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mt-6">
            <h3 className="font-semibold mb-4">
              Maintenance History
            </h3>

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Work Order</th>
                  <th className="text-left py-2">Technician</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b">
                  <td className="py-3">14 Jun 2024</td>
                  <td>WO-3921</td>
                  <td>Hendra K.</td>
                  <td className="text-green-600">Completed</td>
                </tr>

                <tr className="border-b">
                  <td className="py-3">02 Apr 2024</td>
                  <td>WO-8742</td>
                  <td>Sri Aminah</td>
                  <td className="text-green-600">Completed</td>
                </tr>

                <tr>
                  <td className="py-3">11 Jan 2024</td>
                  <td>WO-7210</td>
                  <td>Alex G.</td>
                  <td className="text-green-600">Completed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </Fragment>
  );
}