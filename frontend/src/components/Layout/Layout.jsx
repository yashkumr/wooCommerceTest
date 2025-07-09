import react from "react";
import Header from "./Header.jsx";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import Footer from "./Footer.jsx";

const Layout = ({ children, title, description, keywords, author  }) => {
  return (
    <>
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="author" content={author} />
          <title>{title}</title>
        </Helmet>

        <Header/>
        <Toaster/>
        <main style={{ minHeight: "50vh" }}>{children}</main>
        <Footer/>
      </div>
    </>
  );
};


Layout.defaultProps = {
    title: "User",
    description: "welcome to user",
    keywords: "users",
    author: "vimlesh",
  }; 1      
  
  export default Layout;
  