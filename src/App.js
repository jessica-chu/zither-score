import React, {Component} from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { Analytics, Auth } from 'aws-amplify';
import HomePage from './components/HomePage/HomePage';
import Settings from './components/Settings/Settings';
import Login from './components/LogIn/Login';
import NavBar from './components/NavBar/NavBar';
import Library from './components/Library/Library';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
        Analytics.startSession();
        window.addEventListener('beforeunload', () => {
            Analytics.stopSession();
        })
        Auth.currentAuthenticatedUser().then(user => {
            this.updateCurrentUser(user)
        });
    }

    updateCurrentUser = (user) => {
        this.setState({
            currentUser: user
        })
    }

    onSignOut = async () => {
        await Auth.signOut();
        this.setState({
            currentUser: null
        })
    }

    render () {
        return ( 
            <Router>
                <div className="App">
                    <NavBar loggedInUser={this.state.currentUser} onSignOut={this.onSignOut} />
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/Login" 
                        render = {() => <Login onLogin={this.updateCurrentUser} />}
                    />
                    <Route exact path="/Settings" component={Settings}/>
                    <Route exact path="/Library" component={Library}/>
                </div>
            </Router>
        ); 
    }
}
export default App;
