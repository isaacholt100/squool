import React from "react";
import useContraxtText from "../../hooks/useContraxtText";
import { Grid, Typography, Radio, Slider } from "@material-ui/core";
import { hues, colors, shades } from "../../json/colors";
import styles from "../../css/colorPicker.module.css";

function ColorPicker({ intent, shade, hue, ...props }: {[key: string]: any}) {
    const contrastText = useContraxtText();
    return (
        <Grid item sm={12} md={6}>
            <Typography variant="h6" gutterBottom>
                {intent.replace(/\b\w/g, (l: string) => l.toUpperCase())} Color<br />
            </Typography>
            {hues.map(h => {
                const backgroundColor = colors[h][shade];
                return (
                    <Radio
                        checked={hue === h}
                        onChange={props.handleChangeHue(intent)}
                        value={h}
                        key={h}
                        style={{
                            backgroundColor,
                            color: contrastText(backgroundColor),
                            margin: 3,
                            borderRadius: 6,
                        }}
                    />
                );
            })}
            <Typography style={{ marginTop: 16 }}>
                Shade
            </Typography>
            <Slider
                value={shades.indexOf(shade)}
                min={0}
                max={shades.length - 1}
                color={intent}
                step={1}
                onChange={props.handleChangeShade(intent)}
                onChangeCommitted={props.endChangeShade(intent)}
                className={styles.slider}
            />
        </Grid>
    );
};
export default ColorPicker;