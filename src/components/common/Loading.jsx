import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const Loading = ({ loading }) => {
    return (
        <>
            {loading && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        zIndex: 1,
                    }}
                >
                    <Spinner animation="border" variant="primary" />
                </div>
            )}
        </>
    );
};

export default Loading;