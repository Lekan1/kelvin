import { Input } from 'antd';
import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { useMap } from 'react-map-gl';
import { CITIES } from '../config';

const Controls = () => {
    const { mymap } = useMap();
    const [inputValue, setInputValue] = useState('');
    const [hasError, setError] = useState(false);

    useEffect(() => {
        if (!mymap) {
            return undefined;
        }

        const onMove = (): void => {
            const { lng, lat } = mymap.getCenter();
            setInputValue(`${lng.toFixed(3)}, ${lat.toFixed(3)}`);
            setError(false);
        };
        mymap.on('move', onMove);
        onMove();

        return () => {
            mymap.off('move', onMove);
        };
    }, [mymap]);

    const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValue(evt.target.value);
    }, []);

    const onSubmit = useCallback((): void => {
        const [lng, lat] = inputValue.split(',').map(Number);
        if (Math.abs(lng) <= 180 && Math.abs(lat) <= 85) {
            mymap?.easeTo({
                center: [lng, lat],
                duration: 1000,
            });
        } else {
            setError(true);
        }
    }, [mymap, inputValue]);

    return (
        <div className="space-y-4">
            <section>
                <span>MAP CENTER: </span>
                <Input type="text" value={inputValue} onChange={onChange} style={{ color: hasError ? 'red' : 'black' }} />
                <button onClick={onSubmit}>GO</button>
            </section>

            <div className="space-y-6 flex flex-col">
                {CITIES.map(({ id, lat, lon, name }) => {
                    return (
                        <span className="capitalize text-base cursor-pointer" onClick={() => setInputValue(String(lat))} key={id}>
                            {name}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export default Controls;
