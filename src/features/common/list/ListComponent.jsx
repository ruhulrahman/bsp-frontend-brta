import React from 'react';
import './ListComponent.css';

const ListComponent = ({ renderItem, emptyMessage }) => {
    return (
        <div className="p-0 overflow-scroll relative min-h-[300px]">
            {0 === 0 ? (
                <div className="empty-message">{emptyMessage}</div>
            ) : (
                <table className="mt-2 text-left table table-responsive min-w-max">
                    <thead>
                        <tr>
                            <th>Serial</th>
                            <th>Service Request No</th>
                            <th>Chassis No</th>
                            <th>Engine No</th>
                            <th>Vehicle Class</th>
                            <th>CC</th>
                            <th>Manufacturing Year</th>
                            <th>Application Date</th>
                            <th>Application Status</th>
                            <th className='text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.sl}>
                                {renderItem(item)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ListComponent;
