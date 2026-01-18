import { useNavigate } from "react-router-dom";

const NotFoundError = () => {
  const navigate = useNavigate();
  return (
    <main className="flex h-full w-full items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p
          className="text-3xl md:text-5xl lg:text-6xl font-bold mb-0 md:mb-2"
          style={{ fontFamily: "Torrent" }}
        >
          404 - Page Not Found
        </p>
        <p
          className="text-sm md:text-2xl lg:text-2xl text-gray-600 mb-4"
          style={{ fontFamily: "DMSerif" }}
        >
          Oops! The page you’re looking for doesn’t exist
        </p>
        <button
          style={{ fontFamily: "DMSerif" }}
          className="inline-block bg-yellow-400 hover:bg-yellow-500 border-2 text-black font-bold px-4 md:py-1 rounded-full text-sm transition duration-300"
          onClick={() => navigate("/")}
        >
          Go Back Home
        </button>
      </div>
    </main>
  );
};
export default NotFoundError;
