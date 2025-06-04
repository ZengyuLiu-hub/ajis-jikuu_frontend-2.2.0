import React from 'react';
import { useTranslation } from 'react-i18next';
import { SketchPicker, ColorResult } from 'react-color';
import reactCSS from 'reactcss';
import styled from 'styled-components';

import * as editorConstants from '../../constants/editor';

import { RGBA, Directions } from '../../types';

import {
  Button,
  CheckBox,
  Dropdown,
  HelpIcon,
  InputNumber,
  InputText,
  RadioButton,
  TextArea,
} from '../atoms';

const SketchPickerContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  z-index: 1;
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
`;

const PropertyContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  margin-top: 2px;
  background-color: rgba(255, 255, 255, 1);
  border-top: 1px solid rgba(128, 128, 128, 1);
  border-right: 1px solid rgba(128, 128, 128, 1);
  border-left: 1px solid rgba(128, 128, 128, 1);
`;

const PropertyContainerTitle = styled.div`
  position: relative;
  flex: 1;
  white-space: nowrap;
  padding: 4px 0;
  background: rgba(62, 62, 62, 1);
  width: 120px;
  height: 30px;
  font-size: 10pt;
  font-weight: bold;
  text-align: center;

  > span {
    color: rgba(255, 255, 255, 1);
  }
`;

const PropertyCommand = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 2px;
  height: 30px;
`;

const Properties = styled.div`
  overflow: auto;
  padding: 10px 10px 10px 0;
  background-color: rgba(255, 255, 255, 1);
  border-right: 1px solid rgba(128, 128, 128, 1);
  border-bottom: 1px solid rgba(128, 128, 128, 1);
  border-left: 1px solid rgba(128, 128, 128, 1);
`;

const Property = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  width: 100%;
  min-height: 24px;

  > label {
    display: flex;
    align-items: center;

    span:first-child {
      display: inline-flex;
      justify-content: flex-end;
      margin-right: 3px;
      width: 120px;
    }
  }

  > textarea {
    min-width: 150px;
    max-width: 150px;
  }
`;

const Id = styled(Property)`
  > label {
    input[type='text'] {
      min-width: 50px;
      width: 50px;
    }
  }
`;

const LocationNum = styled(Property)`
  > label {
    input[type='text'] {
      min-width: 50px;
      width: 80px;
    }

    > label {
      margin-left: 6px;
    }
  }
`;

const Direction = styled(Property)``;

const Text = styled(Property)`
  > label {
    input[type='text'] {
      min-width: 50px;
      width: 150px;
    }

    > label {
      margin-left: 6px;
    }
  }
`;

const FontSize = styled(Property)`
  > label {
    input[type='text'] {
      min-width: 30px;
      width: 50px;
    }

    span:nth-child(3) {
      display: inline-block;
      margin: 0 3px 0 1px;
    }

    > label {
      margin-left: 6px;
    }
  }
`;

const XY = styled(Property)`
  > label {
    input[type='text'] {
      min-width: 60px;
      width: 70px;
    }

    span:nth-child(3) {
      display: inline-block;
      margin: 0 3px 0 1px;
    }

    > label {
      margin-left: 6px;
    }
  }
`;

const WidthHeight = styled(Property)`
  > label {
    input[type='text'] {
      min-width: 60px;
      width: 70px;
    }

    span:nth-child(3) {
      display: inline-block;
      margin: 0 3px 0 1px;
    }

    > label {
      margin-left: 6px;
    }
  }
`;

const Rotation = styled(Property)`
  > label {
    input[type='text'] {
      min-width: 50px;
      width: 60px;
    }

    > Button {
      margin-left: 6px;
    }
  }
`;

const StrokeWidth = styled(Property)`
  > label {
    input[type='text'] {
      min-width: 50px;
      width: 60px;
    }

    > label {
      margin-left: 6px;
    }
  }
`;

const Color = styled(Property)`
  > div {
    display: flex;
    align-items: center;

    > div + label {
      margin-left: 10px;
    }
  }
`;

const dynamicColorStyle = (rgba: RGBA, defaultRgba: RGBA) => {
  const backgroundColor = `rgba(${rgba.r ?? defaultRgba.r}, ${
    rgba.g ?? defaultRgba.g
  }, ${rgba.b ?? defaultRgba.b}, ${rgba.a ?? defaultRgba.a})`;

  return reactCSS({
    default: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        backgroundColor,
      },
    },
  });
};

const styles = (strokeColor?: RGBA, fillColor?: RGBA) =>
  reactCSS({
    default: {
      fillColor: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${fillColor?.r ?? 255}, ${fillColor?.g ?? 255}, ${
          fillColor?.b ?? 255
        }, ${fillColor?.a ?? 1})`,
      },
      strokeColor: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${strokeColor?.r ?? 0}, ${strokeColor?.g ?? 0}, ${
          strokeColor?.b ?? 0
        }, ${strokeColor?.a ?? 1})`,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

interface HeaderContentProps {
  disableApplyButton: boolean;
  onClickApply(e: React.MouseEvent<HTMLButtonElement>): void;
}

const HeaderContent = React.memo((props: HeaderContentProps) => {
  const [t] = useTranslation();

  return (
    <PropertyContainer>
      <PropertyContainerTitle>
        <span>{t('organisms:EditorItemProperties.title')}</span>
      </PropertyContainerTitle>
      <PropertyCommand>
        <Button
          onClick={props.onClickApply}
          disabled={props.disableApplyButton}
        >
          {t('organisms:EditorItemProperties.applyButton')}
        </Button>
      </PropertyCommand>
    </PropertyContainer>
  );
});

interface PropertyProps {
  multiSelected: boolean;
  stageWidth: number;
  stageHeight: number;
  latticeWidth: number;
  latticeHeight: number;
  areaIdLength: number;
  tableIdLength: number;
  branchNumLength: number;
  singleNodeConfig: any;
  shapeProperty: any;
  selectedIgnoreLocation: string;
  ignoreLocationItems: any[];
  onChangeShapeProperty(prop: any): void;
  onChangeIgnoreLocation: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

// 表示
const VisibleProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <Property>
      <label>
        <span>{t('organisms:EditorItemProperties.property.visible')}</span>
        <CheckBox
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              visible: e.target.checked,
            });
          }}
          checked={props.shapeProperty.visible}
        />
      </label>
    </Property>
  );
});

// ロケーション番号
const LocationNumProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <LocationNum>
      <label>
        <span>{t('organisms:EditorItemProperties.property.locationNum')}</span>
        <span>{props.shapeProperty.locationNum}</span>
      </label>
    </LocationNum>
  );
});

// フル桁表示
const ShowFullLocationNumProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <LocationNum>
      <label>
        <span>
          {t('organisms:EditorItemProperties.property.showFullLocationNum')}
        </span>
        <CheckBox
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              showFullLocationNum: e.target.checked,
            });
          }}
          checked={props.shapeProperty.showFullLocationNum}
        />
      </label>
    </LocationNum>
  );
});

// エリアID
const AreaIdProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <Id>
      <label>
        <span>{t('organisms:EditorItemProperties.property.areaId')}</span>
        <InputText
          maxLength={props.areaIdLength}
          valueMode="HALF_WIDTH_ALPHABET_AND_NUMBER"
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            const { value } = e.target;

            const areaId =
              value.length === 0
                ? value
                : `${value}`.padStart(props.areaIdLength, '0');

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              areaId,
            });
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              areaId: e.target.value,
            });
          }}
          value={props.shapeProperty.areaId}
        />
      </label>
    </Id>
  );
});

// テーブルID
const TableIdProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <Id>
      <label>
        <span>{t('organisms:EditorItemProperties.property.tableId')}</span>
        <InputText
          maxLength={props.tableIdLength}
          valueMode="HALF_WIDTH_NUMBER"
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            var value = !e.target.value
              ? e.target.value
              : `${e.target.value}`.padStart(props.tableIdLength, '0');
            const changeProps: any = { tableId: value };
            if (
              props.shapeProperty.hasOwnProperty(
                editorConstants.SHAPE_PROP_NAME_LOCATION_NUM,
              )
            ) {
              changeProps.locationNum = `${value}${props.shapeProperty.branchNum}`;
            }

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              ...changeProps,
            });
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              tableId: e.target.value,
            });
          }}
          value={props.shapeProperty.tableId}
        />
      </label>
    </Id>
  );
});

// 枝番
const BranchNumProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <LocationNum>
      <label>
        <span>{t('organisms:EditorItemProperties.property.branchNum')}</span>
        <InputText
          maxLength={props.branchNumLength}
          valueMode="HALF_WIDTH_NUMBER"
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            const { value } = e.target;

            const tableId =
              value.length >= props.tableIdLength + props.branchNumLength
                ? value.slice(0, props.tableIdLength)
                : props.shapeProperty.tableId;

            const branchNum = !value
              ? value
              : `${value}`.padStart(props.branchNumLength, '0');
            const locationNum = `${tableId}${branchNum}`;

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              tableId,
              branchNum,
              locationNum,
            });
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              branchNum: e.target.value,
            });
          }}
          value={props.shapeProperty.branchNum}
        />
      </label>
    </LocationNum>
  );
});

// テキスト
const TextProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <Text>
      <label>
        <span>{t('organisms:EditorItemProperties.property.text')}</span>
        <InputText
          maxLength={255}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              text: e.target.value,
            });
          }}
          value={props.shapeProperty.text}
        />
      </label>
    </Text>
  );
});

// 向き
const DirectionProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <Direction>
      <label>
        <span>
          {t('organisms:EditorItemProperties.property.direction.label')}
        </span>
        <RadioButton
          name="EditorItemProperties.direction"
          value={Directions.TOP}
          label={`${t(
            'organisms:EditorItemProperties.property.direction.top',
          )}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              direction: e.target.value,
            });
          }}
          checked={props.shapeProperty.direction === Directions.TOP}
        />
        <RadioButton
          name="EditorItemProperties.direction"
          value={Directions.RIGHT}
          label={`${t(
            'organisms:EditorItemProperties.property.direction.right',
          )}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              direction: e.target.value,
            });
          }}
          checked={props.shapeProperty.direction === Directions.RIGHT}
        />
        <RadioButton
          name="EditorItemProperties.direction"
          value={Directions.BOTTOM}
          label={`${t(
            'organisms:EditorItemProperties.property.direction.bottom',
          )}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              direction: e.target.value,
            });
          }}
          checked={props.shapeProperty.direction === Directions.BOTTOM}
        />
        <RadioButton
          name="EditorItemProperties.direction"
          value={Directions.LEFT}
          label={`${t(
            'organisms:EditorItemProperties.property.direction.left',
          )}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              direction: e.target.value,
            });
          }}
          checked={props.shapeProperty.direction === Directions.LEFT}
        />
      </label>
    </Direction>
  );
});

// 始点矢印
const PointerAtBeginningProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <Text>
      <label>
        <span>
          {t('organisms:EditorItemProperties.property.pointerAtBeginning')}
        </span>
        <CheckBox
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              pointerAtBeginning: e.target.checked,
            });
          }}
          checked={props.shapeProperty.pointerAtBeginning}
        />
      </label>
    </Text>
  );
});

// 終点矢印
const PointerAtEndingProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <Text>
      <label>
        <span>
          {t('organisms:EditorItemProperties.property.pointerAtEnding')}
        </span>
        <CheckBox
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              pointerAtEnding: e.target.checked,
            });
          }}
          checked={props.shapeProperty.pointerAtEnding}
        />
      </label>
    </Text>
  );
});

// フォントサイズ
const FontSizeProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <FontSize>
      <label>
        <span>{t('organisms:EditorItemProperties.property.fontSize')}</span>
        <InputNumber
          nullBehavior={props.multiSelected ? 'NOTHING' : 'DEFAULT'}
          min={editorConstants.FONT_SIZE_MIN}
          max={editorConstants.FONT_SIZE_MAX}
          onBlur={(e) => {
            const { value } = e.target;

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              fontSize: value ? Number(value) : value,
            });
          }}
          value={props.shapeProperty.fontSize}
        />
      </label>
    </FontSize>
  );
});

// メモ
const RemarksProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <Property>
      <label>
        <span>{t('organisms:EditorItemProperties.property.remarks')}</span>
      </label>
      <TextArea
        maxLength={500}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          e.stopPropagation();

          props.onChangeShapeProperty({
            ...props.shapeProperty,
            remarks: e.target.value,
          });
        }}
        value={props.shapeProperty.remarks}
      />
    </Property>
  );
});

// 欠番
const MissingNumberProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <Property>
      <label>
        <span>
          {t('organisms:EditorItemProperties.property.ignoreLocation')}
        </span>
        <Dropdown
          items={props.ignoreLocationItems}
          valueField="value"
          labelField="label"
          onChange={props.onChangeIgnoreLocation}
          value={props.selectedIgnoreLocation}
        />
      </label>
    </Property>
  );
});

// X 軸、Y 軸
const XyProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <XY>
      <label>
        <span> {t('organisms:EditorItemProperties.property.xy')}</span>
        <InputNumber
          min={0}
          max={props.stageWidth}
          onBlur={(e) =>
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              x: Number(e.target.value),
            })
          }
          value={props.shapeProperty.x}
        />
        <span>,</span>
        <InputNumber
          min={0}
          max={props.stageHeight}
          onBlur={(e) =>
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              y: Number(e.target.value),
            })
          }
          value={props.shapeProperty.y}
        />
      </label>
    </XY>
  );
});

// 幅、高さ（半径）
const RadiusProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <WidthHeight>
      <label>
        <span>{t('organisms:EditorItemProperties.property.radius.label')}</span>
        <InputNumber
          min={props.latticeWidth}
          max={props.stageWidth / 2}
          onBlur={(e) =>
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              radiusX: Number(e.target.value),
            })
          }
          value={props.shapeProperty.radiusX}
        />
        <span>,</span>
        <InputNumber
          min={props.latticeHeight}
          max={props.stageHeight / 2}
          onBlur={(e) =>
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              radiusY: Number(e.target.value),
            })
          }
          value={props.shapeProperty.radiusY}
        />
      </label>
    </WidthHeight>
  );
});

// 幅、高さ（ピクセル）
const WidthHeightProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <WidthHeight>
      <label>
        <span>
          {t('organisms:EditorItemProperties.property.widthHeight.label')}
        </span>
        <InputNumber
          min={props.latticeWidth}
          max={props.stageWidth}
          onBlur={(e) =>
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              width: Number(e.target.value),
            })
          }
          value={props.shapeProperty.width}
        />
        <span>,</span>
        <InputNumber
          min={props.latticeHeight}
          max={props.stageHeight}
          onBlur={(e) =>
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              height: Number(e.target.value),
            })
          }
          value={props.shapeProperty.height}
        />
      </label>
    </WidthHeight>
  );
});

// 幅（ピクセル）
const WidthProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <WidthHeight>
      <label>
        <span>{t('organisms:EditorItemProperties.property.width')}</span>
        <InputNumber
          min={props.latticeWidth}
          max={props.stageWidth}
          onBlur={(e) =>
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              width: Number(e.target.value),
            })
          }
          value={props.shapeProperty.width}
        />
      </label>
    </WidthHeight>
  );
});

// 幅、高さ（セル）
const WidthCellsHeightCellsProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <WidthHeight>
      <label>
        <span>
          {t(
            'organisms:EditorItemProperties.property.widthCellsHeightCells.label',
          )}
        </span>
        <InputNumber
          min={1}
          max={props.stageWidth / props.latticeWidth}
          onBlur={(e) =>
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              widthCells: Number(e.target.value),
            })
          }
          value={props.shapeProperty.widthCells}
        />
        <span>,</span>
        <InputNumber
          min={1}
          max={props.stageHeight / props.latticeHeight}
          onBlur={(e) =>
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              heightCells: Number(e.target.value),
            })
          }
          value={props.shapeProperty.heightCells}
        />
      </label>
    </WidthHeight>
  );
});

// 全体の奥行き
const DepthProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <WidthHeight>
      <label>
        <span>{t('organisms:EditorItemProperties.property.depth')}</span>
        <InputNumber
          nullBehavior={props.multiSelected ? 'NOTHING' : 'DEFAULT'}
          min={props.latticeHeight}
          max={props.stageHeight}
          onBlur={(e) => {
            const { value } = e.target;

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              depth: value ? Number(value) : value,
            });
          }}
          value={props.shapeProperty.depth}
        />
      </label>
    </WidthHeight>
  );
});

// 天板の奥行き
const TableTopDepthProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <WidthHeight>
      <label>
        <span>
          {t('organisms:EditorItemProperties.property.tableTopDepth')}
        </span>
        <InputNumber
          nullBehavior={props.multiSelected ? 'NOTHING' : 'DEFAULT'}
          min={props.latticeHeight}
          max={props.stageHeight}
          onBlur={(e) => {
            const { value } = e.target;

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              tableTopDepth: value ? Number(value) : value,
            });
          }}
          value={props.shapeProperty.tableTopDepth}
        />
      </label>
    </WidthHeight>
  );
});

// 線幅
const StrokeWidthProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <StrokeWidth>
      <label>
        <span>{t('organisms:EditorItemProperties.property.strokeWidth')}</span>
        <InputNumber
          nullBehavior={props.multiSelected ? 'NOTHING' : 'DEFAULT'}
          min={0}
          max={99}
          maxLength={2}
          onBlur={(e) => {
            const { value } = e.target;

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              strokeWidth: value ? Number(value) : value,
            });
          }}
          value={props.shapeProperty.strokeWidth}
        />
        {/** 点線 */}
        {props.shapeProperty.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_STROKE_DASH,
        ) && (
          <CheckBox
            label={`${t('organisms:EditorItemProperties.property.strokeDash')}`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.stopPropagation();

              props.onChangeShapeProperty({
                ...props.shapeProperty,
                strokeDash: e.target.checked,
              });
            }}
            checked={props.shapeProperty.strokeDash}
          />
        )}
      </label>
    </StrokeWidth>
  );
});

interface RightAngleRotationButtonProps extends PropertyProps {
  target: string;
}

const RightAngleRotationButton = React.memo(
  (props: RightAngleRotationButtonProps) => {
    return (
      <Button
        onClick={() => {
          let rotation = Number(props.shapeProperty[props.target]) + 90;
          if (rotation > 180) {
            rotation = -(180 - (rotation - 180));
          }
          props.onChangeShapeProperty({
            ...props.shapeProperty,
            [props.target]: rotation,
          });
        }}
      >
        {'+90'}
      </Button>
    );
  },
);

// 全体回転
const AllRotationProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <Rotation>
      <label>
        <span>{t('organisms:EditorItemProperties.property.rotation')}</span>
        <InputNumber
          min={-180}
          max={180}
          maxLength={4}
          onBlur={(e) =>
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              allRotation: Number(e.target.value),
            })
          }
          value={props.shapeProperty.allRotation}
        />
        <RightAngleRotationButton {...props} target={'allRotation'} />
        <HelpIcon
          message={t(
            'organisms:EditorItemProperties.property.allRotationAnnotation',
          )}
        />
      </label>
    </Rotation>
  );
});

const RotationProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <Rotation>
      <label>
        <span>{t('organisms:EditorItemProperties.property.rotation')}</span>
        <InputNumber
          min={-180}
          max={180}
          maxLength={4}
          onBlur={(e) =>
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              rotation: Number(e.target.value),
            })
          }
          value={props.shapeProperty.rotation}
        />
        <RightAngleRotationButton {...props} target={'rotation'} />
      </label>
    </Rotation>
  );
});

interface StrokePropertyProps extends PropertyProps {
  strokeColor?: RGBA;
  fillColor?: RGBA;
  onShowSketchPicker(rgba?: RGBA): void;
}

// 線色
const StrokeProperty = React.memo((props: StrokePropertyProps) => {
  const [t] = useTranslation();

  return (
    <Color>
      <label>
        <span>{t('organisms:EditorItemProperties.property.stroke')}</span>
      </label>
      <div>
        <div
          style={styles(props.strokeColor, props.fillColor).swatch}
          onClick={() =>
            props.onShowSketchPicker(props.shapeProperty.strokeRgb)
          }
        >
          <div
            style={
              dynamicColorStyle(props.shapeProperty.strokeRgb, {
                r: 0,
                g: 0,
                b: 0,
                a: 1,
              }).color
            }
          ></div>
        </div>
        {/** 透過 */}
        <CheckBox
          label={`${t(
            'organisms:EditorItemProperties.property.strokeTransparent',
          )}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const color: RGBA = { ...props.shapeProperty.strokeRgb };
            if (e.target.checked) {
              color.a = 0;
            } else {
              color.a = 100;
            }

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              stroke: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
              strokeRgb: color,
              strokeTransparent: e.target.checked,
            });
          }}
          checked={props.shapeProperty.strokeTransparent}
        />
      </div>
    </Color>
  );
});

interface FillPropertyProps extends PropertyProps {
  strokeColor?: RGBA;
  fillColor?: RGBA;
  onShowFillSketchPicker(rgba?: RGBA): void;
}

// 塗り
const FillProperty = React.memo((props: FillPropertyProps) => {
  const [t] = useTranslation();

  return (
    <Color>
      <label>
        <span>{t('organisms:EditorItemProperties.property.fill')}</span>
      </label>
      <div>
        <div
          style={styles(props.strokeColor, props.fillColor).swatch}
          onClick={() =>
            props.onShowFillSketchPicker(props.shapeProperty.fillRgb)
          }
        >
          <div
            style={
              dynamicColorStyle(props.shapeProperty.fillRgb, {
                r: 255,
                g: 255,
                b: 255,
                a: 1,
              }).color
            }
          ></div>
        </div>
        {/* 透過 */}
        <CheckBox
          label={`${t(
            'organisms:EditorItemProperties.property.fillTransparent',
          )}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const color: RGBA = { ...props.shapeProperty.fillRgb };
            if (e.target.checked) {
              color.a = 0;
            } else {
              color.a = 100;
            }

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              fill: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
              fillRgb: color,
              fillTransparent: e.target.checked,
            });
          }}
          checked={props.shapeProperty.fillTransparent}
        />
      </div>
    </Color>
  );
});

// アンカー表示
const AlwaysShowAnchorPointProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <Property>
      <label>
        <span>
          {t(
            'organisms:EditorItemProperties.property.alwaysShowAnchorPoint.label',
          )}
        </span>
        <CheckBox
          label={`${t(
            'organisms:EditorItemProperties.property.alwaysShowAnchorPoint.always',
          )}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              alwaysShowAnchorPoint: e.target.checked,
            });
          }}
          checked={props.shapeProperty.alwaysShowAnchorPoint}
        />
      </label>
    </Property>
  );
});

// 左右反転
const FlipHorizontalProperty = React.memo((props: PropertyProps) => {
  const [t] = useTranslation();

  return (
    <Property>
      <label>
        <span>
          {t('organisms:EditorItemProperties.property.flipHorizontal')}
        </span>
        <CheckBox
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();

            props.onChangeShapeProperty({
              ...props.shapeProperty,
              flipHorizontal: e.target.checked,
            });
          }}
          checked={props.shapeProperty.flipHorizontal}
        />
      </label>
    </Property>
  );
});

interface ColorPickerContentProps extends PropertyProps {
  strokeColor?: RGBA;
  displayStrokeColorPicker: boolean;
  fillColor?: RGBA;
  displayFillColorPicker: boolean;
  onCloseSketchPicker(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
}

const ColorPickerContent = React.memo((props: ColorPickerContentProps) => {
  return (
    <SketchPickerContainer onClick={props.onCloseSketchPicker}>
      <SketchPicker
        color={
          props.displayStrokeColorPicker ? props.strokeColor : props.fillColor
        }
        onChange={(color: ColorResult) => {
          if (props.displayStrokeColorPicker) {
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              stroke: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
              strokeRgb: color.rgb,
            });
          }
          if (props.displayFillColorPicker) {
            props.onChangeShapeProperty({
              ...props.shapeProperty,
              fill: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
              fillRgb: color.rgb,
            });
          }
        }}
      />
    </SketchPickerContainer>
  );
});

interface Props
  extends HeaderContentProps,
    PropertyProps,
    StrokePropertyProps,
    FillPropertyProps,
    ColorPickerContentProps {}

/**
 * マップエディタ：シェイププロパティ
 */
export const EditorItemProperties = (props: Props) => {
  const { shapeProperty } = props;

  return (
    <>
      <Container>
        <HeaderContent
          onClickApply={props.onClickApply}
          disableApplyButton={props.disableApplyButton}
        />
        <Properties>
          {/* 表示 */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_VISIBLE,
          ) && <VisibleProperty {...props} />}
          {/* ロケーション番号, フル桁表示 */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_LOCATION_NUM,
          ) && (
            <>
              <LocationNumProperty {...props} />
              <ShowFullLocationNumProperty {...props} />
            </>
          )}
          {/* エリアID */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_AREA_ID,
          ) && <AreaIdProperty {...props} />}
          {/* テーブルID */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_TABLE_ID,
          ) && <TableIdProperty {...props} />}
          {/* 枝番 */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_BRANCH_NUM,
          ) && <BranchNumProperty {...props} />}
          {/* 向き */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_DIRECTION,
          ) && <DirectionProperty {...props} />}
          {/* 始点矢印 */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_POINTER_AT_BEGIN,
          ) && <PointerAtBeginningProperty {...props} />}
          {/* 終点矢印 */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_POINTER_AT_END,
          ) && <PointerAtEndingProperty {...props} />}
          {/* テキスト */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_TEXT,
          ) && <TextProperty {...props} />}
          {/* フォントサイズ */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_FONT_SIZE,
          ) && <FontSizeProperty {...props} />}
          {/* メモ */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_REMARKS,
          ) && <RemarksProperty {...props} />}
          {/* 欠番 */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_MISSING_NUMBER,
          ) &&
            shapeProperty.hasOwnProperty(
              editorConstants.SHAPE_PROP_NAME_EMPTY_NUMBER,
            ) && <MissingNumberProperty {...props} />}
          {/* X 軸、Y 軸 */}
          {shapeProperty.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_X) &&
            shapeProperty.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_Y) && (
              <XyProperty {...props} />
            )}
          {/* 幅、高さ（半径） */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_RADIUS_X,
          ) &&
            shapeProperty.hasOwnProperty(
              editorConstants.SHAPE_PROP_NAME_RADIUS_Y,
            ) && <RadiusProperty {...props} />}
          {/* 幅、高さ（ピクセル） */}
          {!shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_WIDTH_CELLS,
          ) &&
            !shapeProperty.hasOwnProperty(
              editorConstants.SHAPE_PROP_NAME_HEIGHT_CELLS,
            ) &&
            shapeProperty.hasOwnProperty(
              editorConstants.SHAPE_PROP_NAME_WIDTH,
            ) &&
            shapeProperty.hasOwnProperty(
              editorConstants.SHAPE_PROP_NAME_HEIGHT,
            ) && <WidthHeightProperty {...props} />}
          {/* 幅（ピクセル） */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_WIDTH,
          ) &&
            !shapeProperty.hasOwnProperty(
              editorConstants.SHAPE_PROP_NAME_HEIGHT,
            ) && <WidthProperty {...props} />}
          {/* 幅、高さ（セル） */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_WIDTH_CELLS,
          ) &&
            shapeProperty.hasOwnProperty(
              editorConstants.SHAPE_PROP_NAME_HEIGHT_CELLS,
            ) && <WidthCellsHeightCellsProperty {...props} />}
          {/* 全体の奥行き */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_DEPTH,
          ) && <DepthProperty {...props} />}
          {/* 天板の奥行き */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_TABLE_TOP_DEPTH,
          ) && <TableTopDepthProperty {...props} />}
          {/* 線幅 */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_STROKE_WIDTH,
          ) && <StrokeWidthProperty {...props} />}
          {/* 回転 */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_ROTATION,
          ) && <RotationProperty {...props} />}
          {/* 全体回転 */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_ALL_ROTATION,
          ) && <AllRotationProperty {...props} />}
          {/* 線色 */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_STROKE,
          ) && <StrokeProperty {...props} />}
          {/* 塗り */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_FILL,
          ) && <FillProperty {...props} />}
          {/* アンカー表示 */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_ALWAYS_SHOW_ANCHOR_POINT,
          ) && <AlwaysShowAnchorPointProperty {...props} />}
          {/* 左右反転 */}
          {shapeProperty.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_FLIP_HORIZONTAL,
          ) && <FlipHorizontalProperty {...props} />}
        </Properties>
      </Container>
      {(props.displayStrokeColorPicker || props.displayFillColorPicker) && (
        <ColorPickerContent {...props} />
      )}
    </>
  );
};
