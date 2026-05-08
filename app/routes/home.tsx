import "tailwindcss";

export default function Home() {
return <div className="outline-red">
        <div>
            <img src="https://static0.dualshockersimages.com/wordpress/wp-content/uploads/2025/11/arknights-endfield-dualshockers-preview-screenshots.jpg" alt="" />
        </div>

    {/* What We Do */}
        <div className="z-10 bg-[#F8F546] gap-[12vw] flex grid-cols-2 ">
            <div className="bg-white p-[3vw] text-left text-[5vw] mb-[3vh] gap-[vh] flex flex-col">
                <div>
                    <h2 className="text-[3vw] sm:text-[2.5vw] md:text-[3vw] lg:text-[3vw] font-bold mb-[1vh] text-[#202020]">
                        What We Do
                    </h2>
                    <p className="text-[3vw] md:text-[1.5vw] lg:text-[1vw] text-[#202020]">
                        We are a leading company in the industry, providing top-notch solutions and services to our clients.
                    </p>
                    <div className="p-0">
                        <button className="px-[4vw] py-[1.5vh] bg-[#202020] text-white text-[3vw] md:text-[1.5vw] lg:text-[1vw] rounded-xl hover:bg-[#F8F546] transition">
                        Learn More
                        </button>
                    </div>
                </div>

                <div>
                    <div className="border-2 p-10 ">

                    </div>
                    <div>

                    </div>
                </div>
            </div>
            <div className="w-full h-auto p-[2vw_0vw_0vw_0vw] gap-[2vw] mb-[5vh] flex flex-col bg-white">
                <div className="-translate-x-[7vw]">
                    <img src="https://static0.thegamerimages.com/wordpress/wp-content/uploads/wm/2026/01/arknights-endfield-placing-the-pac-structure.jpg?w=1600&h=900&fit=crop" alt="" className="rounded-xl w-full"/>
                </div>
                <div className="-translate-x-[7vw]">
                    <img src="https://blog-uploads.eneba.games/uploads/2026/01/ARKNIGHT-HUB-768x430.jpg" alt="" className="rounded-xl w-full"/>
                </div>
            </div>
        </div>

        <div className="">
            <div>

            </div>
            <div>

            </div>
            <div>

            </div>
        </div>
</div>
}
