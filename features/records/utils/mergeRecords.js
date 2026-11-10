// Junta o registro de um dia aberto SEM internet (`local`) com o que a API já tinha desse mesmo dia (`server`), por exemplo se
// a AT já havia começado o dia em outro aparelho. Os momentos de mesmo tipo e nome são tratados como o mesmo (os ids foram
// sorteados em cada lado); marcações e anotações das duas versões ficam; nas respostas e no resumo, o que a AT escreveu agora vale.
export function mergeRecords(server, local) {
  const used = new Set();
  const idMap = new Map();
  const extraBlocks = [];

  local.blocks.forEach((block) => {
    const match = server.blocks.find((candidate) => !used.has(candidate.id) && candidate.kind === block.kind && candidate.title === block.title);
    if (match) {
      used.add(match.id);
      idMap.set(block.id, match.id);
    } else {
      extraBlocks.push(block);
      idMap.set(block.id, block.id);
    }
  });
  const remap = (blockId) => idMap.get(blockId) ?? blockId;

  const serverEventIds = new Set(server.events.map((event) => event.id));
  const events = [...server.events, ...local.events.filter((event) => !serverEventIds.has(event.id)).map((event) => ({ ...event, blockId: remap(event.blockId) }))];

  const answers = { ...server.answers };
  Object.entries(local.answers ?? {}).forEach(([blockId, blockAnswers]) => {
    const target = remap(blockId);
    answers[target] = { ...(answers[target] ?? {}), ...blockAnswers };
  });

  const writtenSummary = Object.fromEntries(Object.entries(local.summary ?? {}).filter(([, text]) => text?.trim()));

  return {
    ...local,
    status: server.status,
    blocks: [...server.blocks, ...extraBlocks],
    events,
    answers,
    summary: { ...server.summary, ...writtenSummary },
    cursor: local.cursor ? remap(local.cursor) : server.cursor,
  };
}
