import React, { Suspense } from 'react';
import { BarLoader } from "react-spinners";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

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
