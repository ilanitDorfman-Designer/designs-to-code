# EtToggleGroup

Use `EtToggleGroup` for compact segmented controls where each option has the same visual width, commonly icon-only two-option controls.

For label-driven options with intrinsic widths, prefer `EtTextToggle`.

## Usage

```tsx
<EtToggleGroup selectedId={selectedId} onSelectionChange={setSelectedId}>
  <EtToggleGroup.Option id="up">
    {({ selected }) => <EtIconV2 name="arrow-up-right-fill" color={selected ? selectedColor : idleColor} />}
  </EtToggleGroup.Option>
  <EtToggleGroup.Option id="down">
    {({ selected }) => <EtIconV2 name="arrow-down-left-small-fill" color={selected ? selectedColor : idleColor} />}
  </EtToggleGroup.Option>
</EtToggleGroup>
```

## Sizes

- `default`: 40px height, 32px option indicator.
- `small`: 32px height, 24px option indicator.
