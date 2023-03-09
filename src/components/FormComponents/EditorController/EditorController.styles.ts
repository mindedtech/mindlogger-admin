import MdEditor from 'md-editor-rt';
import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledMdEditor = styled(MdEditor)`
  border-radius: ${variables.borderRadius.lg2};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  background-color: ${variables.palette.surface};
  color: ${variables.palette.on_surface_variant};
  font-size: ${variables.font.size.lg};
  box-shadow: unset;
  margin-bottom: ${theme.spacing(2)};
  min-height: 20rem;

  & .md-editor-toolbar-wrapper {
    background-color: ${variables.palette.surface1};
    height: auto;

    & .md-editor-toolbar {
      min-width: auto;
      flex-wrap: wrap;

      & .md-editor-toolbar-left {
        flex-wrap: wrap;
      }

      & .md-editor-toolbar-item {
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
          background-color: ${variables.palette.primary_alfa8};
          border-radius: ${variables.borderRadius.xxxl};
        }

        & svg {
          fill: ${variables.palette.on_surface_variant};
        }
      }
    }
  }

  & .md-editor-dropdown-overlay {
    margin-top: 0;
  }
`;
