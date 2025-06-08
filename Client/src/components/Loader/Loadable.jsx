import { Suspense } from "react";

// project import
import RouteLoader from "./RouteLoader";

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable = (Component) => (props) =>
    (
        <Suspense fallback={<RouteLoader />}>
            <Component {...props} />
        </Suspense>
    );

export default Loadable;
