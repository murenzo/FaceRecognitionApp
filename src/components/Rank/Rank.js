import React from 'react';
import './Rank.css';

const Rank = ({ user }) => {
    return (
        <div>
            <div className="center f3 white">
                {`${user.name}, your current rank is ...`}
            </div>

            <div className="center f1 white">
                {user.entries}
            </div>
        </div>
    )
}

export default Rank;