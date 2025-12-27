{
  description = "VoloScript TreeSitter Nix Dev Environment";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-25.11";
  };

  outputs = { self, nixpkgs, ... }:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
  in
  {
    packages.${system}.tree-sitter-voloscript =
      pkgs.tree-sitter.buildGrammar {
        language = "voloscript";
        version = "0.1.0";
        src = self;
      };

    defaultPackage.${system} = self.packages.${system}.tree-sitter-voloscript;

    devShells.${system}.default = pkgs.mkShell {
      packages = [
        pkgs.gcc
        pkgs.gnumake
        pkgs.nodejs_24
        pkgs.tree-sitter
      ];
    };
  };
}
