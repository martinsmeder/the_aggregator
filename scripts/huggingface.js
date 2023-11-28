require("dotenv").config();
const fetch = require("node-fetch");

const API_TOKEN = process.env.HF_API_TOKEN;

const bart =
  "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

function summarize(data) {
  return fetch(bart, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    method: "POST",
    body: JSON.stringify(data),
  }).then((response) => response.json());
}

// summarize({
//   inputs: `
//   Nucleotides are organic molecules composed of a nitrogenous base, a pentose sugar and a phosphate. They serve as monomeric units of the nucleic acid polymers – deoxyribonucleic acid (DNA) and ribonucleic acid (RNA), both of which are essential biomolecules within all life-forms on Earth. Nucleotides are obtained in the diet and are also synthesized from common nutrients by the liver.[1]

//   Nucleotides are composed of three subunit molecules: a nucleobase, a five-carbon sugar (ribose or deoxyribose), and a phosphate group consisting of one to three phosphates. The four nucleobases in DNA are guanine, adenine, cytosine and thymine; in RNA, uracil is used in place of thymine.

//   Nucleotides also play a central role in metabolism at a fundamental, cellular level. They provide chemical energy—in the form of the nucleoside triphosphates, adenosine triphosphate (ATP), guanosine triphosphate (GTP), cytidine triphosphate (CTP) and uridine triphosphate (UTP)—throughout the cell for the many cellular functions that demand energy, including: amino acid, protein and cell membrane synthesis, moving the cell and cell parts (both internally and intercellularly), cell division, etc.[2] In addition, nucleotides participate in cell signaling (cyclic guanosine monophosphate or cGMP and cyclic adenosine monophosphate or cAMP), and are incorporated into important cofactors of enzymatic reactions (e.g. coenzyme A, FAD, FMN, NAD, and NADP+).

//   In experimental biochemistry, nucleotides can be radiolabeled using radionuclides to yield radionucleotides.

//   5-nucleotides are also used in flavour enhancers as food additive to enhance the umami taste, often in the form of a yeast extract.[3]

//   Structure

//   Showing the arrangement of nucleotides within the structure of nucleic acids: At lower left, a monophosphate nucleotide; its nitrogenous base represents one side of a base-pair. At the upper right, four nucleotides form two base-pairs: thymine and adenine (connected by double hydrogen bonds) and guanine and cytosine (connected by triple hydrogen bonds). The individual nucleotide monomers are chain-joined at their sugar and phosphate molecules, forming two 'backbones' (a double helix) of nucleic acid, shown at upper left.
//   A nucleotide is composed of three distinctive chemical sub-units: a five-carbon sugar molecule, a nucleobase (the two of which together are called a nucleoside), and one phosphate group. With all three joined, a nucleotide is also termed a "nucleoside monophosphate", "nucleoside diphosphate" or "nucleoside triphosphate", depending on how many phosphates make up the phosphate group.

//   In nucleic acids, nucleotides contain either a purine or a pyrimidine base—i.e., the nucleobase molecule, also known as a nitrogenous base—and are termed ribonucleotides if the sugar is ribose, or deoxyribonucleotides if the sugar is deoxyribose. Individual phosphate molecules repetitively connect the sugar-ring molecules in two adjacent nucleotide monomers, thereby connecting the nucleotide monomers of a nucleic acid end-to-end into a long chain. These chain-joins of sugar and phosphate molecules create a 'backbone' strand for a single- or double helix. In any one strand, the chemical orientation (directionality) of the chain-joins runs from the 5'-end to the 3'-end (read: 5 prime-end to 3 prime-end)—referring to the five carbon sites on sugar molecules in adjacent nucleotides. In a double helix, the two strands are oriented in opposite directions, which permits base pairing and complementarity between the base-pairs, all which is essential for replicating or transcribing the encoded information found in DNA.

//   Nucleic acids then are polymeric macromolecules assembled from nucleotides, the monomer-units of nucleic acids. The purine bases adenine and guanine and pyrimidine base cytosine occur in both DNA and RNA, while the pyrimidine bases thymine (in DNA) and uracil (in RNA) occur in just one. Adenine forms a base pair with thymine with two hydrogen bonds, while guanine pairs with cytosine with three hydrogen bonds.

//   In addition to being building blocks for the construction of nucleic acid polymers, singular nucleotides play roles in cellular energy storage and provision, cellular signaling, as a source of phosphate groups used to modulate the activity of proteins and other signaling molecules, and as enzymatic cofactors, often carrying out redox reactions. Signaling cyclic nucleotides are formed by binding the phosphate group twice to the same sugar molecule, bridging the 5'- and 3'- hydroxyl groups of the sugar.[2] Some signaling nucleotides differ from the standard single-phosphate group configuration, in having multiple phosphate groups attached to different positions on the sugar.[4] Nucleotide cofactors include a wider range of chemical groups attached to the sugar via the glycosidic bond, including nicotinamide and flavin, and in the latter case, the ribose sugar is linear rather than forming the ring seen in other nucleotides.
//   `,
//   parameters: {
//     min_length: 150,
//     max_length: 500,
//   },
// }).then((response) => {
//   console.log(JSON.stringify(response));
// });

module.exports = summarize;
