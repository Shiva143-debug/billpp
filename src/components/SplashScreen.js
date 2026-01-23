import { ProgressSpinner } from 'primereact/progressspinner';
import '../styles/SplashScreen.css';

const SplashScreen = () => {
    return (
        <div className="splash-screen">
            <div className="splash-content">
                <div className="">
                    <h1 className="splash-logo">BillPP</h1><br/>
                    <p className="splash-tagline">Your Professional Invoice Manager</p>
                </div>
                <div className="splash-loader">
                    <ProgressSpinner style={{ width: '60px', height: '60px' }} strokeWidth="4" animationDuration=".8s" />
                    <p className="loading-text">Waking up your application...</p>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
