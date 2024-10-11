import React, { Component } from 'react';

function withWindowSize(WrappedComponent) {
    // eslint-disable-next-line react/display-name
    return class extends Component {
        state = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        componentDidMount() {
            window.addEventListener('resize', this.handleResize);
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.handleResize);
        }

        handleResize = () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        render() {
            return <WrappedComponent {...this.props} windowSize={this.state} />;
        }
    };
}

export default withWindowSize;
