import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { withTranslation, useTranslation } from 'react-i18next';

const Loading = ({ loading, loadingText, showText = true, children }) => {
const { t } = useTranslation();
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
                    <div className="d-flex flex-column items-center">
                        <Spinner animation="border" variant="primary" />
                        {showText && !children && <p className="text-gray-600 text-sm">
                            {loadingText ? loadingText : t('loading')}
                        </p>}
                        {children}
                    </div>
                </div>
            )}
        </>
    );
};

export default Loading;