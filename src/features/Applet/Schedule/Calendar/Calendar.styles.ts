import { styled, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents';
import { shouldForwardProp } from 'utils/shouldForwardProp';

export const StyledAddBtn = styled(StyledClearedButton)`
  z-index: ${theme.zIndex.fab};
  position: absolute;
  bottom: 2.2rem;
  right: 3.2rem;
  width: 4rem;
  height: 4rem;
  border-radius: ${variables.borderRadius.lg};
  background-color: ${variables.palette.surface3};
  box-shadow: ${variables.boxShadow.light2};

  svg {
    fill: ${variables.palette.primary};
  }

  &.MuiButton-text:hover {
    background-color: ${variables.palette.surface};
  }
`;

export const StyledCalendarWrapper = styled(Box, shouldForwardProp)`
  position: relative;
  flex-grow: 1;

  &.day {
    .rbc-header {
      height: 0;
      border-bottom: 0;
    }

    .rbc-time-header-content {
      padding: ${({ hasMoreBtn }: { hasMoreBtn: boolean }) =>
        hasMoreBtn ? theme.spacing(1, 0.8, 2.1) : theme.spacing(1, 0.8)};
      border: none;
      position: relative;

      .rbc-row:empty {
        display: none;
      }
    }
  }

  &.week {
    .rbc-time-header-content {
      border: none;
      position: relative;

      .rbc-row:empty {
        display: none;
      }
    }

    .rbc-header {
      border-color: ${variables.palette.surface_variant};
      z-index: ${theme.zIndex.fab};

      .rbc-button-link {
        text-align: right;
      }

      .date {
        display: flex;
        align-items: center;
        padding: ${theme.spacing(0, 0.95)};
        width: fit-content;
        min-width: 4rem;
        height: 4rem;
        margin-top: ${theme.spacing(0.4)};
        margin-left: auto;
        border-radius: ${variables.borderRadius.xxxl2};
      }

      &.rbc-today {
        background-color: transparent;

        .day-name {
          color: ${variables.palette.primary};
        }

        .date {
          color: ${variables.palette.white};
          background-color: ${variables.palette.primary};
        }
      }
    }

    .rbc-allday-cell {
      .rbc-row-content {
        padding: ${({ hasMoreBtn }: { hasMoreBtn: boolean }) =>
          hasMoreBtn ? theme.spacing(1.1, 0, 2.1) : theme.spacing(1.1, 0, 0.9)};
      }

      .rbc-event {
        max-width: 91%;
        margin: 0 auto;
      }
    }
  }

  .rbc-time-content {
    .rbc-events-container {
      margin: ${theme.spacing(0, 0.8)};
      border-left: none;
    }
  }

  .rbc-current-time-indicator {
    display: none;
  }

  .rbc-time-view {
    border-width: ${variables.borderWidth.md} 0 0;
    border-color: ${variables.palette.surface_variant};

    .rbc-event {
      transition: ${variables.transitions.opacity};

      &:hover {
        opacity: 0.9;
      }

      &:focus {
        outline-color: ${variables.palette.primary};
      }
    }
  }

  .rbc-time-header {
    border: none;

    .rbc-header .rbc-button-link {
      pointer-events: none;
      width: 100%;
    }
  }

  .rbc-time-header-cell-single-day {
    display: block;
  }

  .rbc-time-content {
    padding-top: ${theme.spacing(1)};
    border-top: ${variables.borderWidth.xl} solid ${variables.palette.surface_variant};
  }

  .rbc-time-column:first-of-type {
    position: relative;
    z-index: ${theme.zIndex.fab};

    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: -0.1rem;
      width: ${variables.borderWidth.md};
      height: 100%;
      border-right: ${variables.borderWidth.md} solid ${variables.palette.surface};
    }
  }

  .rbc-time-gutter {
    width: 8.5rem;

    .rbc-timeslot-group {
      position: relative;
      border: none;
    }

    .rbc-time-slot {
      .rbc-label {
        position: absolute;
        top: 0;
        right: 0;
        transform: translateY(-50%);
        color: ${variables.palette.outline};
        font-size: ${variables.font.size.md};
        line-height: ${variables.font.lineHeight.md};
        letter-spacing: ${variables.font.letterSpacing.sm};
      }
    }
  }

  .rbc-time-header-gutter {
    padding: ${theme.spacing(1, 0.8)};
  }

  .rbc-timeslot-group {
    min-height: 7.6rem;
  }

  .rbc-day-slot {
    .rbc-timeslot-group {
      border-color: ${variables.palette.surface_variant};
      border-bottom: none;
      border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
      min-height: 7.6rem;
    }

    &.rbc-today {
      background-color: transparent;
    }

    .rbc-time-slot {
      border: none;
    }
  }

  .rbc-row-segment {
    padding-bottom: ${theme.spacing(0.2)};

    &:empty {
      padding-bottom: 0;
    }
  }

  .rbc-event {
    .rbc-event-label {
      display: none;
    }
  }

  .rbc-time-view {
    .rbc-row {
      min-height: unset;
    }

    .rbc-day-bg.rbc-today {
      background-color: unset;
    }
  }

  .rbc-month-view {
    border-left: unset;
    border-bottom: unset;
    border-color: ${variables.palette.surface_variant};

    .rbc-header {
      padding-top: ${theme.spacing(0.3)};
      text-transform: uppercase;
      font-size: ${variables.font.size.sm};
      line-height: ${variables.font.lineHeight.sm};
      letter-spacing: ${variables.font.letterSpacing.xxl};
      color: ${variables.palette.on_surface_variant};
      border-color: ${variables.palette.surface_variant};
      border-bottom: unset;
    }

    .rbc-event {
      max-width: 92%;
      margin: 0 auto;
      transition: ${variables.transitions.opacity};

      &:hover {
        opacity: 0.9;
      }

      &:focus {
        outline-color: ${variables.palette.primary};
      }
    }

    .rbc-row-segment .rbc-event-content {
      white-space: unset;
    }

    .rbc-day-bg {
      border-color: ${variables.palette.surface_variant};

      &.rbc-today {
        background-color: transparent;
      }
    }

    .rbc-date-cell {
      padding: ${theme.spacing(0.25)};

      .rbc-button-link:not(.rbc-show-more) {
        min-width: 2.5rem;
        height: 2.5rem;
        font-family: 'Atkinson', helvetica, arial, sans-serif;
        font-size: ${variables.font.size.md};
        line-height: ${variables.font.lineHeight.md};
        letter-spacing: ${variables.font.letterSpacing.lg};
        color: ${variables.palette.on_surface_variant};
        transition: ${variables.transitions.opacity};
        padding: ${theme.spacing(0, 0.5)};

        &:hover {
          opacity: 0.8;
        }
      }

      &.rbc-now {
        .rbc-button-link:not(.rbc-show-more) {
          background-color: ${variables.palette.primary};
          color: ${variables.palette.white};
          border-radius: ${variables.borderRadius.xxxl2};
        }
      }
    }

    .rbc-show-more {
      margin: ${theme.spacing(0.2, 0, 0, 0.9)};
      font-size: ${variables.font.size.sm};
      line-height: ${variables.font.lineHeight.sm};
      letter-spacing: ${variables.font.letterSpacing.xxl};
      color: ${variables.palette.on_surface_variant};
      transition: ${variables.transitions.opacity};

      &:hover {
        opacity: 0.8;
      }
    }

    .rbc-off-range {
      opacity: 0.38;
    }

    .rbc-off-range-bg {
      background: transparent;
    }
  }
`;
