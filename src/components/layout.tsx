import { type PropsWithChildren } from "react";

const PageLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex min-h-screen justify-center">
      <div className="w-full border-x border-slate-400 md:max-w-2xl">
        {children}
      </div>
    </main>
  );
};

export default PageLayout;
