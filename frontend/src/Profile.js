import React, { Component } from 'react';
import ProfileWindow from './components/User/UserProfile';
import Header from './components/Header';
import Footer from './components/Footer';

class Profile extends Component {
    render() {
        return (
            <div>
                <Header />
                <ProfileWindow />
                <Footer />
            </div>
        );
    }
}

export default Profile;

