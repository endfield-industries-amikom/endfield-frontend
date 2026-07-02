import { Fragment, useState } from "react";

function MasterData() {
  return (
    <div className="space-y-6">


      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-4">
          <img
            src="https://via.placeholder.com/500x300"
            className="rounded-lg w-full"
          />
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-4">Machine Specifications</h3>

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


      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold mb-4">Spindle Speed</h4>
          <p className="text-4xl font-bold text-center">12,400 RPM</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold mb-4">Vibration</h4>
          <div className="h-32 flex items-end gap-2">
            {[20,45,25,80,40,30,55,25].map((v,i)=>(
              <div key={i} className="bg-yellow-500 flex-1" style={{height:`${v}%`}}/>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold mb-4">Temperature</h4>
          <p className="text-4xl font-bold">42.8°C</p>
          <p className="text-green-600 mt-2">Stable</p>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold mb-4">Maintenance History</h3>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th>Date</th>
              <th>Work Order</th>
              <th>Technician</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td>14 Jun 2024</td>
              <td>WO-3921</td>
              <td>Hendra</td>
              <td className="text-green-600">Completed</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}



function Production() {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Production Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6 mt-6">

        <div className="bg-white p-6 rounded-xl">
          <h3>Total Production</h3>
          <p className="text-4xl font-bold">
            1,250
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl">
          <h3>Active Machines</h3>
          <p className="text-4xl font-bold">
            18
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl">
          <h3>Downtime</h3>
          <p className="text-4xl font-bold">
            2h
          </p>
        </div>

      </div>
    </div>
  );
}



function Procurement() {
  return (
     <div className="min-h-screen bg-stone-100 p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">
            Procurement
          </h1>
          <p className="text-sm text-stone-500">
            Kelola pengadaan barang, vendor, dan permintaan pembelian
          </p>
        </div>

        <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
          + New Request
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-stone-500">Open Requests</h2>
          <p className="text-3xl font-bold mt-2">18</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-stone-500">Approved</h2>
          <p className="text-3xl font-bold mt-2">42</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-stone-500">Pending Approval</h2>
          <p className="text-3xl font-bold mt-2">7</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">
          Recent Purchase Requests
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b">
                <th className="py-2">PR ID</th>
                <th>Item</th>
                <th>Department</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="py-2">PR-001</td>
                <td>Laptop Dell</td>
                <td>IT</td>
                <td className="text-yellow-600">Pending</td>
                <td>$1,200</td>
              </tr>

              <tr className="border-b">
                <td className="py-2">PR-002</td>
                <td>Office Chair</td>
                <td>HR</td>
                <td className="text-green-600">Approved</td>
                <td>$300</td>
              </tr>

              <tr>
                <td className="py-2">PR-003</td>
                <td>Printer</td>
                <td>Finance</td>
                <td className="text-red-600">Rejected</td>
                <td>$500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Logistics() {
  return (
    <div className="space-y-6">

  
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">
            Logistics Dashboard
          </h1>
          <p className="text-sm text-stone-500">
            Monitor pengiriman, stok, dan aktivitas logistik
          </p>
        </div>

        <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg shadow hover:bg-yellow-300 transition">
          + Add Shipment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold">Active Shipments</h2>
          <p className="text-3xl font-bold mt-2">24</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold">Pending Orders</h2>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold">Delivered Today</h2>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>

      </div>


      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

        <div className="space-y-3 text-sm">

          <div className="flex justify-between border-b pb-2">
            <span>Shipment #A1023</span>
            <span className="text-green-600">Delivered</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Shipment #A1024</span>
            <span className="text-yellow-600">In Transit</span>
          </div>

          <div className="flex justify-between">
            <span>Shipment #A1025</span>
            <span className="text-blue-600">Processing</span>
          </div>

        </div>
      </div>

    </div>
  );
}

function Analytics() {
  return  <div>
      <h1 className="text-3xl font-bold mb-6">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Machine Efficiency</h3>
          <p className="text-4xl font-bold mt-2">98%</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Production Output</h3>
          <p className="text-4xl font-bold mt-2">12,540</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Downtime</h3>
          <p className="text-4xl font-bold mt-2">2.1h</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">
            Production Trend
          </h3>

          <div className="h-48 flex items-end gap-2">
            {[35, 50, 45, 70, 85, 60, 90].map((v, i) => (
              <div
                key={i}
                className="bg-yellow-500 flex-1 rounded-t"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">
            Machine Utilization
          </h3>

          <div className="flex justify-center items-center h-48">
            <div className="w-40 h-40 rounded-full border-[16px] border-yellow-500 flex items-center justify-center">
              <span className="text-4xl font-bold">92%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h3 className="font-semibold mb-4">
          Performance Summary
        </h3>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Metric</th>
              <th className="text-left py-2">Value</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-3">Efficiency</td>
              <td>98%</td>
              <td className="text-green-600">Excellent</td>
            </tr>

            <tr className="border-b">
              <td className="py-3">Downtime</td>
              <td>2.1h</td>
              <td className="text-yellow-600">Normal</td>
            </tr>

            <tr>
              <td className="py-3">Output Target</td>
              <td>12,540 / 13,000</td>
              <td className="text-green-600">On Track</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
}


function Report() {
  return  <div className="min-h-screen bg-stone-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">
            Reports
          </h1>
          <p className="text-sm text-stone-500">
            Analisis data, performa, dan ringkasan aktivitas sistem
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border rounded-lg shadow hover:bg-stone-50">
            Export PDF
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-stone-500">Total Reports</h2>
          <p className="text-3xl font-bold mt-2">128</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-stone-500">Generated This Month</h2>
          <p className="text-3xl font-bold mt-2">24</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-stone-500">Pending Review</h2>
          <p className="text-3xl font-bold mt-2">7</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-sm text-stone-500">Success Rate</h2>
          <p className="text-3xl font-bold mt-2">96%</p>
        </div>
      </div>


      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Report Overview
        </h2>

        <div className="h-64 flex items-center justify-center text-stone-400 border-2 border-dashed rounded-lg">
          Chart Area (bisa pakai Recharts / Chart.js)
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">
          Recent Reports
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b">
                <th className="py-2">Report ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="py-2">RPT-001</td>
                <td>Monthly Sales</td>
                <td>Finance</td>
                <td className="text-green-600">Completed</td>
                <td>2026-06-10</td>
              </tr>

              <tr className="border-b">
                <td className="py-2">RPT-002</td>
                <td>Inventory Summary</td>
                <td>Logistics</td>
                <td className="text-yellow-600">Processing</td>
                <td>2026-06-12</td>
              </tr>

              <tr>
                <td className="py-2">RPT-003</td>
                <td>Procurement Analysis</td>
                <td>Procurement</td>
                <td className="text-blue-600">Draft</td>
                <td>2026-06-14</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
}


export default function Dashboard() {
  const [active, setActive] = useState("masterdata");

  const menu = [
    { id: "masterdata", label: "Master Data" },
    { id: "production", label: "Production" },
    { id: "procurement", label: "Procurement" },
    { id: "logistics", label: "Logistics" },
    { id: "analytics", label: "Analytics" },
    { id: "report", label: "Report" },
  ];

  return (
    <Fragment>
      <div className="flex min-h-screen bg-stone-100">


        <aside className="w-64 bg-stone-200 p-4 shadow-lg border-r-4 border-yellow-400">

          <h1 className="text-2xl font-bold text-yellow-600 mb-6">
            Endfield ERP
          </h1>

          <nav className="space-y-2">
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`
                  w-full text-left p-3 rounded-lg transition-all
                  hover:bg-yellow-100 hover:translate-x-1

                  ${
                    active === item.id
                      ? "bg-yellow-400 font-semibold shadow"
                      : "text-stone-700"
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </nav>

        </aside>


        <main className="flex-1 p-6">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">
              Endfield ERP Dashboard
            </h2>

            <span className="px-3 py-1 text-sm bg-yellow-400 rounded-full shadow">
              Live System
            </span>
          </div>

          {/* CONTENT SWITCH */}
          <div className="animate-[fadeIn_0.3s_ease-in-out]">

            {active === "masterdata" && <MasterData />}
            {active === "production" && <Production />}
            {active === "procurement" && <Procurement />}
            {active === "logistics" && <Logistics />}
            {active === "analytics" && <Analytics />}
            {active === "report" && <Report />}

          </div>

        </main>

      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </Fragment>
  );
}