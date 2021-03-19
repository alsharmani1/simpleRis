import React from 'react';
import Accordion from './Accordion';

const Schedule = () => {
  const accordionData = [
    {
      title: 'John Smith',
      content: `PA-578548   Dr. Willam Barr    9:00 A.M.    01/01/20XX`
    },
    {
      title: 'Jane Doe',
      content: `PA-789632   Dr. Harry Rosen    12:00 P.M.   01/01/20XX`
    },
    {
      title: 'Jerry Trois',
      content: `PA-963852   Dr. Elena Robins   1:00 P.M.    01/01/20XX`
    }
  ];

  return (
    <div>
      <h1>Today's Schedule</h1>
      <div className="accordion">
        {accordionData.map(({ title, content }) => (
          <Accordion title={title} content={content} />
        ))}
      </div>
    </div>
  );
};

export default Schedule;
