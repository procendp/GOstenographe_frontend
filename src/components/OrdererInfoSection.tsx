import { useEffect, useCallback } from 'react';

import { ReceptionFormData } from '@/types/reception';

const MAX_SPEAKERS = 10;

interface OrdererInfoSectionProps {
  formData: ReceptionFormData;
  setFormData: (data: ReceptionFormData) => void;
}

export default function OrdererInfoSection({ formData, setFormData }: OrdererInfoSectionProps) {
  // Initialize speaker names if not present
  useEffect(() => {
    if (!formData.speakerNames || formData.speakerNames.length === 0) {
      const defaultNames = [''];
      setFormData({
        ...formData,
        speakerNames: defaultNames,
        speakerCount: defaultNames.length
      });
    }
  }, [formData, setFormData]);

  const handleSpeakerNameUpdate = useCallback((index: number, name: string) => {
    const newSpeakerNames = [...(formData.speakerNames || [])];
    newSpeakerNames[index] = name;
    setFormData({ 
      ...formData, 
      speakerNames: newSpeakerNames,
      speakerCount: newSpeakerNames.length
    });
  }, [formData, setFormData]);

  const handleSpeakerDelete = useCallback((index: number) => {
    const newSpeakerNames = [...(formData.speakerNames || [])];
    newSpeakerNames.splice(index, 1);
    setFormData({ 
      ...formData, 
      speakerNames: newSpeakerNames,
      speakerCount: newSpeakerNames.length
    });
  }, [formData, setFormData]);

  const handleSpeakerAdd = useCallback(() => {
    if ((formData.speakerNames?.length || 0) < MAX_SPEAKERS) {
      const newSpeakerNames = [...(formData.speakerNames || []), ''];
      setFormData({ 
        ...formData, 
        speakerNames: newSpeakerNames,
        speakerCount: newSpeakerNames.length
      });
    }
  }, [formData, setFormData, MAX_SPEAKERS]);

  return (
    <div className="c-speaker-container" style={{
      backgroundColor: '#f4f6f9',
      borderRadius: '10px',
      padding: '2rem',
      marginTop: '0.5rem',
      width: 'calc(100% + 4rem)',
      marginLeft: '-2rem',
      marginRight: '-2rem'
    }}>
      {/* Speaker Information Section */}
      <div className="c-speaker-block">
        <div className="div-w-layout-vflex c-spk-table-wrapper" style={{
          border: '1px solid #d1d5db',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: 'white',
          width: '100%',
          maxWidth: 'none',
          marginLeft: '0',
          marginRight: '0'
        }}>
          {/* Header Section */}
          <div className="c-spk-header" style={{
            backgroundColor: '#cad5e5',
            padding: '1rem 1.5rem',
            display: 'grid',
            gridTemplateColumns: '80px 1fr',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div className="c-file-block-heading" style={{
              textAlign: 'center',
              margin: '0',
              fontSize: '14px'
            }}>
              No.
            </div>
            <div>
              <h3 className="c-file-block-heading" style={{
                margin: '0 0 4px 0',
                fontSize: '14px',
                textAlign: 'left',
                fontWeight: 'normal'
              }}>
                화자 이름
              </h3>
              <p className="c-paragraph-speaker-info" style={{
                margin: '0',
                fontSize: '14px',
                color: '#3b82f6',
                textAlign: 'left',
                fontFamily: 'Pretendard, sans-serif',
                lineHeight: '1.6'
              }}>
                • 알 수 없는 경우 <strong>남자 1</strong>, <strong>여자 1</strong>의 형태로 작성해 주세요.
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="c-spk-content" style={{
            padding: '1.5rem'
          }}>
            {/* Speaker rows */}
            {(formData.speakerNames || []).map((name, index) => (
              <div key={`speaker-row-${index}`} style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 80px',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: index < (formData.speakerNames?.length || 1) - 1 ? '1rem' : '0'
              }}>
                <div style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  color: '#374151'
                }}>
                  {index + 1}
                </div>
                <div>
                  <input
                    type="text"
                    value={name || ''}
                    onChange={(e) => {
                      const trimmedValue = e.target.value.trim();
                      if (trimmedValue.length <= 10) {
                        handleSpeakerNameUpdate(index, trimmedValue);
                      }
                    }}
                    placeholder="화자 이름 입력 (최대 10글자)"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  {(formData.speakerNames?.length || 0) > 1 && (
                    <button
                      type="button"
                      onClick={() => handleSpeakerDelete(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#3b82f6',
                        fontSize: '14px',
                        textDecoration: 'underline'
                      }}
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add button */}
            {(formData.speakerNames?.length || 0) < MAX_SPEAKERS && (
              <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px dashed #d1d5db'
              }}>
                <button
                  type="button"
                  onClick={handleSpeakerAdd}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px dashed #3b82f6',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    color: '#3b82f6',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>+</span>
                  추가
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 