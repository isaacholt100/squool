import React, { memo } from "react";
import useContraxtText from "../../hooks/useContraxtText";
import { Grid, Typography, Box, Radio, Slider } from "@material-ui/core";
import { hues, colors, shades } from "../../json/colors";

export default memo(({ intent, shade, hue, ...props }: {[key: string]: any}) => {
    const contrastText = useContraxtText();
    return (
        <Grid item sm={12} md={6}>
            <Typography variant="h6" gutterBottom>
                {intent.replace(/\b\w/g, l => l.toUpperCase())} Color<br />
            </Typography>
            {hues.map(h => {
                const backgroundColor = colors[h][shade];
                return (
                    <Box clone m="2px" key={h}>
                        <Radio
                            checked={hue === h}
                            onChange={props.handleChangeHue(intent)}
                            value={h}
                            key={h}
                            style={{
                                backgroundColor,
                                color: contrastText(backgroundColor),
                            }}
                        />
                    </Box>
                );
            })}
            <Typography style={{ marginTop: 16 }}>
                Shade
            </Typography>
            <Box clone m="8px" width="calc(100% - 32px) !important">
                <Slider
                    value={shades.indexOf(shade)}
                    min={0}
                    max={13}
                    color={intent}
                    step={1}
                    onChange={props.handleChangeShade(intent)}
                    onChangeCommitted={props.endChangeShade(intent)}
                />
            </Box>
        </Grid>
    );
});