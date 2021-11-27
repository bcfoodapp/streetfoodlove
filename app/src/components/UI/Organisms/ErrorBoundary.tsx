import React from 'react';

export class ErrorBoundary extends React.Component<{}, {error: string}> {
  constructor(props) {
    super(props);
    this.state = {error: ''};
  }

  static getDerivedStateFromError(error) {
    return {error: error.toString()}
  }

  render() {
    if (this.state.error.length > 0) {
      return <pre>{this.state.error}</pre>
    }

    return this.props.children;
  }
}
