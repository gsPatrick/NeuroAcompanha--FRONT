import OptionList from '@/components/ui/molecules/OptionList/OptionList';
import SelectableCard from '@/components/ui/molecules/SelectableCard/SelectableCard';
import { NEURODIVERGENCES } from '../../data/neurodivergences';
import styles from './NeurodivergenceStep.module.css';

// Passo "neurodivergências": escolhe uma ou mais e, em cada uma, o nível que consta no laudo.
// selections: [{ id, levels: { [grupo]: opção } }]. Os níveis são opcionais.
export default function NeurodivergenceStep({ selections, onToggle, onChangeLevel }) {
  return (
    <div className={styles.list}>
      {NEURODIVERGENCES.map((condition) => {
        const selection = selections.find((item) => item.id === condition.id);
        const hasContent = condition.levelGroups.length > 0 || Boolean(condition.hint);

        return (
          <SelectableCard
            key={condition.id}
            title={condition.label}
            subtitle={condition.fullName}
            selected={Boolean(selection)}
            onToggle={() => onToggle(condition.id)}
          >
            {hasContent ? (
              <>
                {condition.levelGroups.map((group) => (
                  <div key={group.id} className={styles.group}>
                    <p className={styles.groupLabel}>{group.label}</p>
                    <OptionList
                      label={`${condition.label}: ${group.label}`}
                      options={group.options}
                      value={selection?.levels?.[group.id]}
                      onChange={(optionId) => onChangeLevel(condition.id, group.id, optionId)}
                    />
                  </div>
                ))}
                {condition.hint ? <p className={styles.hint}>{condition.hint}</p> : null}
              </>
            ) : null}
          </SelectableCard>
        );
      })}
    </div>
  );
}
