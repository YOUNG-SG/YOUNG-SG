const Navbar = () => {
  return (
    // [REMOVE] h: 100vh, ml-auto으로 (화면우측 고정)
    <nav className="w-[100px] h-screen bg-gray-700 bg-opacity-40 backdrop-blur-4 ml-auto flex flex-col justify-between items-center py-[40px]">
      <div>로고</div>
      <img
        src="src/assets/@test/profile.jpg"
        className="w-[50px] h-[50px] rounded-full object-cover"
      />
    </nav>
  );
};

export default Navbar;
