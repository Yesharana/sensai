import React, { Suspense } from 'react';
import { BarLoader } from "react-spinners";

const Layout = ({ children }) => {
  return ( 
  <div className="px-5">
    <Suspense 
      fallback={<BarLoader className="mt-4" width={"1000%"} color="gray" />}
    >
      {children}
    </Suspense>

  </div>
  );
};

export default Layout;
