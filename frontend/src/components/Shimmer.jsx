const Shimmer = () => {
  return (
    <div className="mt-5 mx-2 flex flex-wrap gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card w-96 bg-base-300 animate-pulse">
          <div className="card-body">
            <div className="h-6 bg-gray-400 rounded w-3/4"></div>
            <div className="h-4 bg-gray-400 rounded w-full mt-2"></div>
            <div className="h-4 bg-gray-400 rounded w-5/6 mt-2"></div>
            <div className="h-3 bg-gray-400 rounded w-1/2 mt-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shimmer;
