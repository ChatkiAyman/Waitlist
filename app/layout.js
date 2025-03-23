import Theming from "@/Theme/Theming";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

import Headpage from "./Header/page";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Theming>
          <Headpage />
          <main>{children}</main>
        </Theming>
        <SpeedInsights />
      </body>
    </html>
  );
}
