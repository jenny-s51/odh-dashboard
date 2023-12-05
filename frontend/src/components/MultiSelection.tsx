import * as React from 'react';
import {
  Button,
  Chip,
  ChipGroup,
  HelperText,
  HelperTextItem,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  SelectOptionProps,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from '@patternfly/react-core';
import { MenuItemStatus } from '~/pages/groupSettings/groupTypes';
import { TimesIcon } from '@patternfly/react-icons';

type MultiSelectionType = SelectOptionProps & MenuItemStatus;

type MultiSelectionProps = {
  value: MenuItemStatus[];
  setValue: (itemSelection: MenuItemStatus[]) => void;
  ariaLabel: string;
};

export const MultiSelection: React.FC<MultiSelectionProps> = ({ value, setValue, ariaLabel }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  console.log('VALUE', value);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [focusedItemIndex, setFocusedItemIndex] = React.useState<number | null>(null);
  const [activeItem, setActiveItem] = React.useState<string | null>(null);
  const textInputRef = React.useRef<HTMLInputElement>();

  const initialSelectValues: MenuItemStatus[] = value;
  const [selectOptions, setSelectOptions] = React.useState<MenuItemStatus[]>(initialSelectValues);
  const [selected, setSelected] = React.useState<string[]>(value.map((item) => item.name));

  React.useEffect(() => {
    let newSelectOptions: MenuItemStatus[] = initialSelectValues;

    // Filter menu items based on the text input value when one exists
    if (inputValue) {
      newSelectOptions = initialSelectValues.filter((menuItem) =>
        String(menuItem.name).toLowerCase().includes(inputValue.toLowerCase()),
      );

      // When no options are found after filtering, display 'No results found'
      if (!newSelectOptions.length) {
        newSelectOptions = [
          {
            enabled: true,
            id: -1,
            name: `No results found for "${inputValue}"`,
          },
        ];
      }

      // Open the menu when the input value changes and the new value is not empty
      if (!showMenu) {
        setShowMenu(true);
      }
    }

    setSelectOptions(newSelectOptions);
    setFocusedItemIndex(null);
    setActiveItem(null);
  }, [inputValue]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const onSelect = (newValue: string) => {
    // eslint-disable-next-line no-console
    console.log('selected', newValue);

    if (newValue && newValue !== 'no results') {
      setSelected(
        selected.includes(newValue)
          ? selected.filter((selection) => selection !== newValue)
          : [...selected, newValue],
      );

      const newState = value.map((element) =>
        element.name === newValue ? { ...element, enabled: !element.enabled } : element,
      );
      setValue(newState);
    }

    textInputRef.current?.focus();
  };

  const clearSelection = () => {
    const newState = value?.map((element) => ({ ...element, enabled: false }));
    setValue(newState);
  };

  const onTextInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setInputValue(value);
  };

  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus: number = -1;

    if (showMenu) {
      if (key === 'ArrowUp') {
        // When no index is set or at the first index, focus to the last, otherwise decrement focus index
        if (focusedItemIndex === null || focusedItemIndex === 0) {
          indexToFocus = selectOptions.length - 1;
        } else {
          indexToFocus = focusedItemIndex - 1;
        }
      }

      if (key === 'ArrowDown') {
        // When no index is set or at the last index, focus to the first, otherwise increment focus index
        if (focusedItemIndex === null || focusedItemIndex === value.length - 1) {
          indexToFocus = 0;
        } else {
          indexToFocus = focusedItemIndex + 1;
        }
      }

      setFocusedItemIndex(indexToFocus);
      const focusedItem = selectOptions.filter((option) => option.enabled)[indexToFocus];
      setActiveItem(`select-multi-typeahead-${focusedItem.name.replace(' ', '-')}`);
    }
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const enabledMenuItems = value.filter((menuItem) => menuItem.enabled);
    const [firstMenuItem] = enabledMenuItems;
    const focusedItem = focusedItemIndex ? enabledMenuItems[focusedItemIndex] : firstMenuItem;

    switch (event.key) {
      // Select the first available option
      case 'Enter':
        if (!showMenu) {
          setShowMenu((prevIsOpen) => !prevIsOpen);
        } else if (showMenu && focusedItem.name !== 'no results') {
          onSelect(focusedItem.name);
        }
        break;
      case 'Tab':
      case 'Escape':
        setShowMenu(false);
        setActiveItem(null);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        handleMenuArrowKeys(event.key);
        break;
    }
  };

  const noSelectedItems = value?.filter((option) => option.enabled).length === 0;

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      variant="typeahead"
      onClick={toggleMenu}
      innerRef={toggleRef}
      isExpanded={showMenu}
      isFullWidth
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={inputValue}
          onClick={toggleMenu}
          onChange={onTextInputChange}
          onKeyDown={onInputKeyDown}
          id="multi-typeahead-select-input"
          autoComplete="off"
          innerRef={textInputRef}
          placeholder="Select a state"
          {...(activeItem && { 'aria-activedescendant': activeItem })}
          role="combobox"
          isExpanded={showMenu}
          aria-controls="select-multi-typeahead-listbox"
        >
          <ChipGroup aria-label="Current selections">
            {selected.map((selection, index) => (
              <Chip
                key={index}
                onClick={(ev) => {
                  ev.stopPropagation();
                  onSelect(selection);
                }}
              >
                {selection}
              </Chip>
            ))}
          </ChipGroup>
        </TextInputGroupMain>
        <TextInputGroupUtilities>
          {value.length > 0 && (
            <Button
              variant="plain"
              onClick={() => {
                setInputValue('');
                setValue([]);
                setSelected([]);
                textInputRef?.current?.focus();
              }}
              aria-label="Clear input value"
            >
              <TimesIcon aria-hidden />
            </Button>
          )}
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <>
      <Select
        id="multi-typeahead-select"
        isOpen={showMenu}
        selected={value.filter((element) => element.enabled).map((element) => element.name)}
        onSelect={(e, newValue) => {
          if (newValue && newValue !== 'no results') {
            setSelected(
              selected.includes(newValue as string)
                ? selected.filter((selection) => selection !== (newValue as string))
                : [...selected, newValue as string],
            );
            if (value?.filter((option) => option.name === newValue).length) {
              const newState = value.map((element) =>
                element.name === newValue ? { ...element, enabled: !element.enabled } : element,
              );
              setValue(newState);
            }
          }
        }}
        onOpenChange={() => setShowMenu(false)}
        toggle={toggle}
      >
        <SelectList isAriaMultiselectable id="select-multi-typeahead-listbox">
          {selectOptions?.map((option, index) => (
            <SelectOption
              key={index}
              value={option.name}
              id={`select-multi-typeahead-${option.name.replace(' ', '-')}`}
              isFocused={focusedItemIndex === index}
              ref={null}
            >
              {option.name}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
      {noSelectedItems && (
        <HelperText>
          <HelperTextItem variant="error" hasIcon>
            One or more group must be selected
          </HelperTextItem>
        </HelperText>
      )}
    </>
  );
};
