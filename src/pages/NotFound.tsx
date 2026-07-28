import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-foreground">404</h1>
        <p className="text-xl text-muted-foreground">
          We couldn't find the page <span className="font-mono">{location.pathname}</span>
        </p>
        <Link to="/" className="inline-block text-primary underline underline-offset-4">
          Return to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
