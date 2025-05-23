import { useEffect, useRef } from 'react';

export default function ScrollableComponent(props) {
  // Create a ref to reference the scrollable element
  const scrollableRef = useRef(null);

  useEffect(() => {
    // Scroll to the top of the component when content changes
    scrollableRef.current.scrollTo(0, 0);
  }, [props.content]);

  return (
    <div
      ref={scrollableRef}
      style={{
        overflowY: 'auto',
        height: '150px', // Set a fixed height for scrollable area
      }}
    >
      {props.children}
    </div>
  );
}