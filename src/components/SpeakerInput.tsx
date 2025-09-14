import { useState, useEffect } from 'react';

interface SpeakerInputProps {
  name: string;
  index: number;
  onUpdate: (index: number, name: string) => void;
  onDelete: () => void;
  canDelete?: boolean;
}

export default function SpeakerInput({ name, index, onUpdate, onDelete, canDelete = true }: SpeakerInputProps) {
  const [speakerName, setSpeakerName] = useState(name);

  useEffect(() => {
    onUpdate(index, speakerName);
  }, [speakerName]);

  const handleNameChange = (value: string) => {
    // Limit to 10 characters
    if (value.length <= 10) {
      setSpeakerName(value);
    }
  };

  return (
    <div className="w-layout-hflex c-timestamp-wrapper" style={{ justifyContent: 'flex-start' }}>
      <div className="w-layout-hflex timestamp-h-flex" style={{ justifyContent: 'flex-start' }}>
        <div className="c-time-input-grid" style={{ 
          border: '1px solid #d1d5db',
          borderRadius: '5px',
          gridTemplateColumns: '1fr',
          gridColumnGap: '0px',
          gridRowGap: '0px',
          placeItems: 'center stretch',
          width: '100%',
          maxWidth: '400px',
          padding: '2px',
          display: 'grid',
          backgroundColor: 'white'
        }}>
          <div className="div-block-10">
            <input
              type="text"
              value={speakerName || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={`화자 ${index + 1}`}
              className="c-input-text"
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                width: '100%',
                textAlign: 'center',
                fontFamily: 'var(--_concept-1---font-normal)',
                color: !speakerName ? 'var(--_concept-1---color-set-2--light-grey)' : 'var(--_concept-1---color-set-2--grey)',
                fontSize: 'var(--_concept-1---font-size--pc_p-button)',
                padding: '8px'
              }}
            />
          </div>
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="c-timestamp-delete"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 8px',
              fontFamily: 'var(--_concept-1---font-normal)',
              color: 'var(--_concept-1---color-set-2--blue80)',
              fontSize: 'var(--_concept-1---font-size--pc_p-button)'
            }}
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}