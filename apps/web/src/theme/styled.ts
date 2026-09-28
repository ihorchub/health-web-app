import { styled as muiStyled } from '@mui/material/styles';

/** Drop `$…` transient style props so they never leak onto DOM nodes. */
const omitDollarProps = (prop: PropertyKey) =>
  typeof prop !== 'string' || !prop.startsWith('$');

/**
 * Medicly `styled` — same as MUI Emotion `styled`, but `$tone` / `$size` / etc.
 * are not forwarded to the underlying element (avoids React DOM warnings).
 */
export const styled = ((
  component: Parameters<typeof muiStyled>[0],
  options?: Parameters<typeof muiStyled>[1],
) =>
  muiStyled(component, {
    ...options,
    shouldForwardProp: (prop) => {
      if (!omitDollarProps(prop)) {
        return false;
      }
      if (options?.shouldForwardProp) {
        return options.shouldForwardProp(prop as string);
      }
      return true;
    },
  })) as typeof muiStyled;
