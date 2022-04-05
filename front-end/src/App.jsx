import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Profile from "./components/Users/Profile/Profile";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import UpdateProfile from "./components/Users/UpdateProfile/UpdateProfile";
import "./App.scss";
import PostsPage from "./pages/PostsPage/PostsPage";
import UserPostList from "./components/Users/UserPostList/UserPostList";
import CreatePost from "./components/Posts/CreatePost/CreatePost";
import PostDetails from "./components/Posts/PostDetails/PostDetails";
import EditPost from "./components/Posts/EditPost/EditPost";
import ApplyJob from "./components/ApplyJob/ApplyJob";
import LoginWithGoolge from "./components/Users/LoginWithGoolge/LoginWithGoolge";
import CreateAccount from "./components/Users/CreateAccount/CreateAccount";
import Chatbox from "./components/Chatbox/Chatbox";
function App() {
  return (
    <Router>
      <Header />

      <Switch>
        <Route path="/" exact component={PostsPage} />
        <Route path="/loginWithGoogle" component={LoginWithGoolge} />
        <Route path="/registerSuccee" component={CreateAccount} />
        <Route path="/profile/:id" component={Profile} />
        <Route path="/users/posts/:id" component={UserPostList} />
        <Route path="/category" component={CategoryPage} />
        <Route path="/updateProfile/:id" component={UpdateProfile} />
        <Route path="/createpost" component={CreatePost} />
        <Route path="/post/:postID" component={PostDetails} />
        <Route path="/postEdit/:postID" component={EditPost} />
        <Route path="/chatbox" component={Chatbox} />
        <Route path="/postApply/:postID" component={ApplyJob} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
