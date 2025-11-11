import Footer from "./components/Footer";
import Header from "./components/Header";
import { WebProvider } from "./context/ContextProvider";
import { AppToaster } from "./components/ToasterComponent";

export default function LayoutContainer({children}: {children:React.ReactNode}) {
    return (
        <div>
            <WebProvider>

            <AppToaster />
            
            <Header />

            <div className="my-18 px-2">
                {children}
            </div>

            <Footer />

            </WebProvider>
        </div>
    )
}