export const FeaturesHero = () => {
    return (   
        <div className="flex flex-wrap flex-row justify-center w-full mx-auto  max-w-[clamp(1px,73.8888888889vw,1064px)] mb-10">
            <div id="card1" className="relative bg-blue-200 rounded-2xl px-2 py-2 w-2/3 border border-blue-900">
                <span className="head_text">Personal Journaling</span>
                <h1>Let your thoughts flow freely with our private and secure digital journaling feature. From recording your thoughts to tracking your mood, journaling is a therapeutic tool that can empower you to better understand your emotions and patterns. Start your journaling journey and unlock the benefits of self-reflection today.</h1>
            </div>
            <div id="card2" className="relative bg-purple-200 rounded-2xl px-2 py-2 w-1/3 border border-red-600">
                <span className="head_text">Tailored Chat Sessions</span>
                <h1>Experience a highly personalized therapy journey, as our AI-powered virtual therapist adapts to your unique preferences, goals, and progress, guiding you through evidence-based techniques, mindful exercises, and cognitive-behavioral strategies</h1>
            </div>
            <div id="card3" className="relative bg-red-200 rounded-2xl px-2 py-2 w-1/3 border border-green-600">
                <span className="head_text">To-Do List</span>
                <h1>prioritize your goals, track your progress, and cultivate a sense of achievement. Gain control over your busy schedule and get closer to achieving your personal and professional goals.</h1>
            </div>
            <div id="card4" className="relative  w-2/3 ">
                <div className="bg-green-200 rounded-2xl px-2 py-2 border border-purple-600">
                    <span className="head_text">Meditation</span>
                    <h1>We believe that everyone should have the opportunity to experience the transformative benefits of meditation, which is why we provide a wide range of high-quality guided meditations at no cost. Explore our collection and embark on a journey of self-discovery, relaxation, and inner peace, all conveniently accessible online, anytime, and from anywhere.</h1>
                </div>
                <div className="bg-cyan-200 rounded-2xl px-2 border border-red-600 justify-center items-center flex flex-col">
                    <span className="head_text">Button</span>
                    <h1>Click me boy!</h1>
                </div>
            </div>

        </div>
    )
}