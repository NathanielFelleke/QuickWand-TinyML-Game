#ifndef RASTERIZE_STROKE_H
#define RASTERIZE_STROKE_H

#include <cstdint>

void RasterizeStroke(
    int8_t* stroke_points,
    int stroke_points_count,
    float x_range, 
    float y_range, 
    int width, 
    int height,
    int8_t* out_buffer);

#endif   
